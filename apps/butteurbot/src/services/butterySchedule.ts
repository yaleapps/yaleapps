import type { calendar_v3 } from "@googleapis/calendar";
import { addHours, isWithinInterval } from "date-fns";
import { getMessageFromUnknownError } from "../utils";

const MAX_BUTTERY_SHIFT_HOURS = 3;

import type { GoogleCalendarService } from "./calendar";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;

type ButteryOpenStatus =
	| "NOW/CONFIRMED_OPEN"
	| "NOW/CONFIRMED_CLOSED"
	| "NOW/UNCONFIRMED_OPEN"
	| "NOW/UNCONFIRMED_CLOSED"
	| "TODAY/CONFIRMED_OPEN"
	| "TODAY/CONFIRMED_CLOSED"
	| "TODAY/UNCONFIRMED_OPEN"
	| "TODAY/UNCONFIRMED_CLOSED";

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	const getOngoingOrTodayShift =
		async (): Promise<calendar_v3.Schema$Event | null> => {
			try {
				const { items: shifts } = await googleCalendarService.listEvents({
					timeMin: new Date().toISOString(),
					timeMax: addHours(
						new Date(),
						24 - MAX_BUTTERY_SHIFT_HOURS,
					).toISOString(),
					maxResults: 1,
					singleEvents: true,
					orderBy: "startTime",
				});
				return shifts?.at(0) ?? null;
			} catch (error) {
				throw new Error(
					`Failed to get next event: ${getMessageFromUnknownError(error)}`,
				);
			}
		};

	return {
		getButteryScheduleMessage: async () => {
			const getButteryScheduleStatus = async (): Promise<ButteryOpenStatus> => {
				try {
					const shift = await getOngoingOrTodayShift();

					if (!shift || !shift.start?.dateTime || !shift.end?.dateTime) {
						return "TODAY/UNCONFIRMED_CLOSED";
					}
					const isOngoing = isWithinInterval(new Date(), {
						start: new Date(shift.start.dateTime),
						end: new Date(shift.end.dateTime),
					});
					const timeframe = isOngoing ? "NOW" : "TODAY";
					if (shift.summary?.startsWith(STATUS_PREFIXES.CLOSED)) {
						return `${timeframe}/CONFIRMED_CLOSED`;
					}

					if (shift.summary?.startsWith(STATUS_PREFIXES.OPEN)) {
						return `${timeframe}/CONFIRMED_OPEN`;
					}

					return `${timeframe}/UNCONFIRMED_OPEN`;
				} catch (error) {
					throw new Error(`Error getting buttery open status: ${error}`);
				}
			};
			const butteryScheduleStatusToMessage = {
				"NOW/CONFIRMED_OPEN": "The buttery is confirmed open now!",
				"NOW/CONFIRMED_CLOSED": "The buttery is confirmed closed now!",
				"NOW/UNCONFIRMED_OPEN":
					"The buttery should be open now according to the Buttery schedule!",
				"NOW/UNCONFIRMED_CLOSED":
					"The buttery should be closed now according to the Buttery schedule!",
				"TODAY/CONFIRMED_OPEN": "The buttery is confirmed open today!",
				"TODAY/CONFIRMED_CLOSED": "The buttery is confirmed closed today!",
				"TODAY/UNCONFIRMED_OPEN":
					"The buttery should be open today according to the Buttery schedule!",
				"TODAY/UNCONFIRMED_CLOSED":
					"The buttery should be closed today according to the Buttery schedule!",
			} as const satisfies Record<ButteryOpenStatus, string>;
			const butteryScheduleStatus = await getButteryScheduleStatus();
			const message = butteryScheduleStatusToMessage[butteryScheduleStatus];
			return message;
		},
		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			try {
				const shift = await getOngoingOrTodayShift();

				if (!shift?.id) {
					throw new Error("No upcoming events found");
				}

				if (shift.summary === null || shift.summary === undefined) {
					throw new Error("No event summary found");
				}

				const summaryWithoutPrefix = shift.summary
					?.replace(STATUS_PREFIXES.OPEN, "")
					?.replace(STATUS_PREFIXES.CLOSED, "");

				return googleCalendarService.updateEvent(shift.id, {
					...shift,
					summary: `${STATUS_PREFIXES[status]}${summaryWithoutPrefix}`,
				});
			} catch (error) {
				throw new Error(`Error marking next shift as ${status}: ${error}`);
			}
		},
	};
}
