import type { ServiceAccountCredentials } from "./types";
import { GoogleAuth } from "./auth";
import { GoogleCalendar } from "./calendar";

const credentials: ServiceAccountCredentials = {
	email: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
	key: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "",
	scopes: ["https://www.googleapis.com/auth/calendar"],
};

const auth = new GoogleAuth(credentials);
const calendar = new GoogleCalendar(auth);

export async function isButteryOpen(
	calendarId: string,
	timeToCheck: Date,
): Promise<boolean> {
	try {
		const timeMin = new Date(timeToCheck);
		const timeMax = new Date(timeToCheck);
		// Look for events ±24 hours from our target time
		timeMin.setHours(timeMin.getHours() - 24);
		timeMax.setHours(timeMax.getHours() + 24);

		const response = await calendar.listEvents(calendarId, {
			timeMin: timeMin.toISOString(),
			timeMax: timeMax.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		console.log("Checking for events between:", {
			timeMin: timeMin.toISOString(),
			timeMax: timeMax.toISOString(),
			targetTime: timeToCheck.toISOString(),
		});

		console.log(
			"Found events:",
			response.items?.map((event) => ({
				start: event.start?.dateTime,
				end: event.end?.dateTime,
				summary: event.summary,
			})),
		);

		// Check if any events overlap with our target time
		return (
			response.items?.some((event) => {
				if (!event.start?.dateTime || !event.end?.dateTime) {
					console.warn("Unexpected event format:", event);
					return false;
				}
				const eventStart = new Date(event.start.dateTime);
				const eventEnd = new Date(event.end.dateTime);
				const isOverlapping =
					timeToCheck >= eventStart && timeToCheck <= eventEnd;
				if (isOverlapping) {
					console.log("Found overlapping event:", {
						start: event.start.dateTime,
						end: event.end.dateTime,
						summary: event.summary,
					});
				}
				return isOverlapping;
			}) ?? false
		);
	} catch (error) {
		console.error("Error checking time within events:", error);
		return false;
	}
}

const calendarId = process.env.GRACE_HOPPER_CALENDAR_ID;
if (!calendarId) {
	console.error("Calendar ID not configured");
	process.exit(1);
}

isButteryOpen(calendarId, new Date()).then((result) => {
	console.log(result);
});
