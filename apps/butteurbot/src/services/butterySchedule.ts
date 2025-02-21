import { isWithinInterval, subHours, addHours } from "date-fns";
import type { GoogleCalendarService } from "./calendar";
import { getMessageFromUnknownError } from "../utils";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	return {
		isOpenNow: async (): Promise<
			| "is open (confirmed by managers)"
			| "is closed (confirmed by managers)"
			| "should be open according to the Buttery schedule (awaiting confirmation by managers)"
			| "should be closed according to the Buttery schedule"
		> => {
			const now = new Date();
			const SEARCH_WINDOW_HOURS = 4;
			try {
				const searchWindowStart = subHours(now, SEARCH_WINDOW_HOURS);
				const searchWindowEnd = addHours(now, SEARCH_WINDOW_HOURS);

				const eventsInSearchWindow = await googleCalendarService.listEvents({
					timeMin: searchWindowStart.toISOString(),
					timeMax: searchWindowEnd.toISOString(),
					singleEvents: true,
					orderBy: "startTime",
				});

				const eventsContainingNow =
					eventsInSearchWindow.items?.filter((event) => {
						if (!event.start?.dateTime || !event.end?.dateTime) return false;

						const isEventContainingNow = isWithinInterval(now, {
							start: new Date(event.start.dateTime),
							end: new Date(event.end.dateTime),
						});

						return isEventContainingNow;
					}) ?? [];

				if (eventsContainingNow.length === 0) {
					return "should be closed according to the Buttery schedule";
				}

				for (const event of eventsContainingNow) {
					if (event.summary?.startsWith("[CLOSED]")) {
						return "is closed (confirmed by managers)";
					}

					if (event.summary?.startsWith("[OPEN]")) {
						return "is open (confirmed by managers)";
					}
				}

				return "should be open according to the Buttery schedule (awaiting confirmation by managers)";
			} catch (error) {
				throw new Error(
					`Error checking Buttery hours: ${getMessageFromUnknownError(error)}`,
				);
			}
		},
		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;
			try {
				const nextEvent = await googleCalendarService.getNextEvent();
				if (
					!nextEvent?.id ||
					nextEvent.summary === null ||
					nextEvent.summary === undefined
				) {
					throw new Error("No upcoming events found");
				}

				const summaryWithoutPrefix = nextEvent.summary
					?.replace(STATUS_PREFIXES.OPEN, "")
					.replace(STATUS_PREFIXES.CLOSED, "");

				switch (status) {
					case "OPEN": {
						const updatedEvent = await googleCalendarService.updateEvent(
							nextEvent.id,
							{
								...nextEvent,
								summary: `${STATUS_PREFIXES.OPEN}${summaryWithoutPrefix}`,
							},
						);
						return updatedEvent;
					}
					case "CLOSED": {
						const updatedEvent = await googleCalendarService.updateEvent(
							nextEvent.id,
							{
								...nextEvent,
								summary: `${STATUS_PREFIXES.CLOSED}${summaryWithoutPrefix}`,
							},
						);
						return updatedEvent;
					}
				}
			} catch (error) {
				throw new Error(`Error marking next shift as ${status}: ${error}`);
			}
		},
	};
}
