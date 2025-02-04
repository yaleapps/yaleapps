import GoogleAuth from "cloudflare-workers-and-google-oauth";
import { createGoogleCalendar } from "./calendar";

// Google Calendar API credentials for authentication

const credentials = {
	email: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
	key: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "",
	scopes: ["https://www.googleapis.com/auth/calendar"],
};

const auth = new GoogleAuth(
	{
		type: "service_account",
		project_id: "butteurbot",
		private_key_id: "",
		client_id: "",
		client_email: credentials.email,
		private_key: credentials.key,
		token_uri: "https://oauth2.googleapis.com/token",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(credentials.email)}`,
	},
	credentials.scopes,
);
const calendar = createGoogleCalendar(auth);

/**
 * Checks if the Buttery is open at a specific time by looking for calendar events
 * that overlap with the given time.
 */
export async function isButteryOpen({
	calendarId,
	timeToCheck,
}: {
	calendarId: string;
	timeToCheck: Date;
}): Promise<boolean> {
	try {
		const HOURS_TO_SEARCH = 24;
		const msInHour = 60 * 60 * 1000;

		// Create a time window as a single object with start/end times
		const searchWindow = {
			start: new Date(timeToCheck.getTime() - HOURS_TO_SEARCH * msInHour),
			end: new Date(timeToCheck.getTime() + HOURS_TO_SEARCH * msInHour),
		};

		// Fetch all events within our search window
		const response = await calendar.listEvents(calendarId, {
			timeMin: searchWindow.start.toISOString(),
			timeMax: searchWindow.end.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		// Log the search parameters for debugging
		console.log("Searching for Buttery events in time window:", {
			windowStart: searchWindow.start.toISOString(),
			windowEnd: searchWindow.end.toISOString(),
			targetTime: timeToCheck.toISOString(),
		});

		// Log all found events for debugging
		console.log(
			"Found Buttery events:",
			response.items?.map((event) => ({
				start: event.start?.dateTime,
				end: event.end?.dateTime,
				summary: event.summary,
			})),
		);

		// Check if the target time falls within any of the found events
		const isOpenAtTime = response.items?.some((event) => {
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

// Validate required environment variables
const calendarId = process.env.GRACE_HOPPER_CALENDAR_ID;
if (!calendarId) {
	console.error(
		"Grace Hopper Calendar ID not configured in environment variables",
	);
	process.exit(1);
}

// Example usage: Check if the Buttery is currently open
isButteryOpen({ calendarId, timeToCheck: new Date() }).then((isOpen) => {
	console.log(`The Buttery is currently ${isOpen ? "open" : "closed"}`);
});
