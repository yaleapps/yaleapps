import type { GoogleCalendar } from "./services/calendar";

const MS_IN_HOUR = 60 * 60 * 1000;

/**
 * Checks if the Buttery is open at a specific time by looking for calendar events
 * that overlap with the given time.
 */
export async function isButteryOpen(
	googleCalendar: GoogleCalendar,
	{
		calendarId,
		timeToCheck,
	}: {
		calendarId: string;
		timeToCheck: Date;
	},
): Promise<boolean> {
	try {
		const HOURS_TO_SEARCH = 24;

		const timeWindowStart = new Date(
			timeToCheck.getTime() - HOURS_TO_SEARCH * MS_IN_HOUR,
		);
		const timeWindowEnd = new Date(
			timeToCheck.getTime() + HOURS_TO_SEARCH * MS_IN_HOUR,
		);

		// Log the search parameters for debugging
		console.log("Searching for Buttery events in time window:", {
			windowStart: timeWindowStart.toISOString(),
			windowEnd: timeWindowEnd.toISOString(),
			targetTime: timeToCheck.toISOString(),
		});

		const eventsInTimeWindow = await googleCalendar.listEvents(calendarId, {
			timeMin: timeWindowStart.toISOString(),
			timeMax: timeWindowEnd.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		// Log all found events for debugging
		console.log(
			"Found Buttery events:",
			eventsInTimeWindow.items?.map((event) => ({
				start: event.start?.dateTime,
				end: event.end?.dateTime,
				summary: event.summary,
			})),
		);

		// Check if the target time falls within any of the found events
		const isOpenAtTime = eventsInTimeWindow.items?.some((event) => {
			if (!event.start?.dateTime || !event.end?.dateTime) {
				console.warn("Found event with invalid date format:", event);
				return false;
			}

			const eventStart = new Date(event.start.dateTime);
			const eventEnd = new Date(event.end.dateTime);

			const isButteryCoveredByEvent =
				timeToCheck >= eventStart && timeToCheck <= eventEnd;

			if (isButteryCoveredByEvent) {
				console.log("Found matching Buttery hours:", {
					start: event.start.dateTime,
					end: event.end.dateTime,
					summary: event.summary,
				});
			}

			return isButteryCoveredByEvent;
		});

		return isOpenAtTime ?? false;
	} catch (error) {
		console.error("Failed to check Buttery hours:", error);
		return false;
	}
}
