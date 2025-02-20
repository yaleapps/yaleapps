import type { GoogleCalendarService } from "./calendar";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	return {
		isOpenNow: async (): Promise<boolean> => {
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
				console.log("Searching for Buttery events in time window:", {
					searchWindowStart: searchWindowStart.toISOString(),
					searchWindowEnd: searchWindowEnd.toISOString(),
					targetTime: now.toISOString(),
				});

				const eventsInSearchWindow = await googleCalendarService.listEvents({
					timeMin: searchWindowStart.toISOString(),
					timeMax: searchWindowEnd.toISOString(),
					singleEvents: true,
					orderBy: "startTime",
				});

				console.log(
					"Found Buttery events:",
					eventsInSearchWindow.items?.map((event) => ({
						start: event.start?.dateTime,
						end: event.end?.dateTime,
						summary: event.summary,
					})),
				);

				const isTargetTimeWithinEvent = eventsInSearchWindow.items?.some(
					(event) => {
						if (!event.start?.dateTime || !event.end?.dateTime) {
							console.warn("Found event with invalid date format:", event);
							return false;
						}

						const eventStartTime = new Date(event.start.dateTime);
						const eventEndTime = new Date(event.end.dateTime);
						const isWithinEvent = now >= eventStartTime && now <= eventEndTime;

						if (isWithinEvent) {
							console.log("Matching Buttery event found:", {
								start: event.start.dateTime,
								end: event.end.dateTime,
								summary: event.summary,
							});
						}

						return isWithinEvent;
					},
				);

				return isTargetTimeWithinEvent ?? false;
			} catch (error) {
				console.error("Error checking Buttery hours:", error);
				return false;
			}
		},
		updateNextEventStatus: async (status: "confirmed" | "cancelled") => {
			try {
				const nextEvent = await googleCalendarService.getNextEvent();
				if (!nextEvent?.id) throw new Error("No upcoming events found");
				const updatedEvent = await googleCalendarService.updateEvent(
					nextEvent.id,
					{ ...nextEvent, status },
				);
				return updatedEvent;
			} catch (error) {
				throw new Error(`Error updating event status: ${error}`);
			}
		},
	};
}
