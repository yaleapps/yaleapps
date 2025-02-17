import type { GoogleCalendarService } from "./services/calendar";

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const SEARCH_WINDOW_HOURS = 4;

/**
 * Checks if the Buttery is open at a specific time by looking for calendar events
 * that overlap with the given time.
 */
export async function isButteryOpen(
	googleCalendarService: GoogleCalendarService,
	{
		calendarId,
		targetTime,
	}: {
		calendarId: string;
		targetTime: Date;
	},
): Promise<boolean> {
	try {
		const searchWindowStart = new Date(
			targetTime.getTime() - SEARCH_WINDOW_HOURS * MILLISECONDS_PER_HOUR,
		);
		const searchWindowEnd = new Date(
			targetTime.getTime() + SEARCH_WINDOW_HOURS * MILLISECONDS_PER_HOUR,
		);

		// Log the search parameters for debugging
		console.log("Searching for Buttery events in time window:", {
			searchWindowStart: searchWindowStart.toISOString(),
			searchWindowEnd: searchWindowEnd.toISOString(),
			targetTime: targetTime.toISOString(),
		});

		const eventsInSearchWindow = await googleCalendarService.listEvents(calendarId, {
			timeMin: searchWindowStart.toISOString(),
			timeMax: searchWindowEnd.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		// Log all found events for debugging
		console.log(
			"Found Buttery events:",
			eventsInSearchWindow.items?.map((event) => ({
				start: event.start?.dateTime,
				end: event.end?.dateTime,
				summary: event.summary,
			})),
		);

		// Check if the target time falls within any of the found events
		const isTargetTimeWithinEvent = eventsInSearchWindow.items?.some(
			(event) => {
				if (!event.start?.dateTime || !event.end?.dateTime) {
					console.warn("Found event with invalid date format:", event);
					return false;
				}

				const eventStartTime = new Date(event.start.dateTime);
				const eventEndTime = new Date(event.end.dateTime);

				const isWithinEvent =
					targetTime >= eventStartTime && targetTime <= eventEndTime;

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
}
