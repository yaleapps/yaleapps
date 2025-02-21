import { isWithinInterval } from "date-fns";
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
			const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
			const SEARCH_WINDOW_HOURS = 4;
			try {
				const searchWindowStart = new Date(
					now.getTime() - SEARCH_WINDOW_HOURS * MILLISECONDS_PER_HOUR,
				);
				const searchWindowEnd = new Date(
					now.getTime() + SEARCH_WINDOW_HOURS * MILLISECONDS_PER_HOUR,
				);

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
							start: event.start.dateTime,
							end: event.end.dateTime,
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
		markNextShiftAs: async (status: "open" | "closed") => {
			try {
				const nextEvent = await googleCalendarService.getNextEvent();
				if (!nextEvent?.id) throw new Error("No upcoming events found");

				const updatedEvent = await googleCalendarService.updateEventStatus(
					nextEvent.id,
					status,
				);
				return updatedEvent;
			} catch (error) {
				throw new Error(`Error marking next shift as ${status}: ${error}`);
			}
		},
	};
}
