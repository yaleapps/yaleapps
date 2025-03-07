import type { calendar_v3 } from "@googleapis/calendar";
import { addHours, isWithinInterval } from "date-fns";
import { getMessageFromUnknownError } from "../utils";
import type { GoogleCalendarService } from "./calendar";

const MAX_BUTTERY_SHIFT_HOURS = 3;

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;

type ButteryStatus =
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
	const getOngoingOrTodayEvent = async () => {
		try {
			const { items: events } = await googleCalendarService.listEvents({
				timeMin: new Date().toISOString(),
				timeMax: addHours(
					new Date(),
					24 - MAX_BUTTERY_SHIFT_HOURS,
				).toISOString(),
				maxResults: 1,
				singleEvents: true,
				orderBy: "startTime",
			});
			return events?.at(0) ?? null;
		} catch (error) {
			throw new Error(
				`Failed to get next event: ${getMessageFromUnknownError(error)}`,
			);
		}
	};

	const isEventOngoing = (event: calendar_v3.Schema$Event) => {
		const now = new Date();
		if (!event.start?.dateTime || !event.end?.dateTime) return false;
		const start = new Date(event.start.dateTime);
		const end = new Date(event.end.dateTime);
		return isWithinInterval(now, { start, end });
	};

	return {
		getOngoingOrTodayEvent,
		getButteryScheduleMessage: async () => {
			const getButteryStatus = async (): Promise<ButteryStatus> => {
				try {
					const event = await getOngoingOrTodayEvent();
					if (!event) return "TODAY/UNCONFIRMED_CLOSED";
					const timeframe = isEventOngoing(event) ? "NOW" : "TODAY";
					if (event.summary?.startsWith(STATUS_PREFIXES.OPEN))
						return `${timeframe}/CONFIRMED_OPEN`;
					if (event.summary?.startsWith(STATUS_PREFIXES.CLOSED))
						return `${timeframe}/CONFIRMED_CLOSED`;
					return `${timeframe}/UNCONFIRMED_OPEN`;
				} catch (error) {
					throw new Error(`Error getting buttery open status: ${error}`);
				}
			};
			const butteryStatusToMessage = {
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
			} as const satisfies Record<ButteryStatus, string>;
			const butteryStatus = await getButteryStatus();
			const message = butteryStatusToMessage[butteryStatus];
			return message;
		},
		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			try {
				const maybeEvent = await getOngoingOrTodayEvent();
				if (!maybeEvent) throw new Error("No upcoming event found");
				if (!maybeEvent.id) throw new Error("Upcoming event has no id");
				if (!maybeEvent.summary)
					throw new Error("Upcoming event has no summary");

				const summaryWithoutPrefix = maybeEvent.summary
					.replace(STATUS_PREFIXES.OPEN, "")
					.replace(STATUS_PREFIXES.CLOSED, "");

				return googleCalendarService.updateEvent(maybeEvent.id, {
					...maybeEvent,
					summary: `${STATUS_PREFIXES[status]}${summaryWithoutPrefix}`,
				});
			} catch (error) {
				throw new Error(`Error marking next shift as ${status}: ${error}`);
			}
		},
	};
}
