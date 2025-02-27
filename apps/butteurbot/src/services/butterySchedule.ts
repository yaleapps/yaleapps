import { TZDate, tz } from "@date-fns/tz";
import type { calendar_v3 } from "@googleapis/calendar";
import { addHours, isWithinInterval, subHours } from "date-fns";
import { getMessageFromUnknownError } from "../utils";

const MAX_BUTTERY_SHIFT_HOURS = 3;

import type { GoogleCalendarService } from "./calendar";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;

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
		getButteryOpenStatus: async (): Promise<
			| "NOW/CONFIRMED_CLOSED"
			| "NOW/CONFIRMED_OPEN"
			| "NOW/UNCONFIRMED"
			| "TODAY/CONFIRMED_CLOSED"
			| "TODAY/CONFIRMED_OPEN"
			| "TODAY/UNCONFIRMED"
		> => {
			try {
				const shift = await getOngoingOrTodayShift();

				if (!shift || !shift.start?.dateTime || !shift.end?.dateTime) {
					return "TODAY/CONFIRMED_CLOSED";
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

				return `${timeframe}/UNCONFIRMED`;
			} catch (error) {
				throw new Error(`Error getting buttery open status: ${error}`);
			}
		},

		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			try {
				const shift = await getOngoingOrTodayShift();

				if (
					!shift?.id ||
					shift.summary === null ||
					shift.summary === undefined
				) {
					throw new Error("No upcoming events found");
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
