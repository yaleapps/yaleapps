import type { calendar_v3 } from "@googleapis/calendar";
import GoogleAuth from "cloudflare-workers-and-google-oauth";
import { getMessageFromUnknownError } from "../utils";

export type GoogleCalendarService = ReturnType<
	typeof createGoogleCalendarService
>;

export function createGoogleCalendarService({
	clientEmail,
	clientId,
	privateKeyId,
	privateKey,
	calendarId,
}: {
	clientEmail: string;
	clientId: string;
	privateKeyId: string;
	privateKey: string;
	calendarId: string;
}) {
	const auth = new GoogleAuth(
		{
			type: "service_account",
			project_id: "yaleapps",
			private_key_id: privateKeyId,
			private_key: privateKey,
			client_email: clientEmail,
			client_id: clientId,
			auth_uri: "https://accounts.google.com/o/oauth2/auth",
			token_uri: "https://oauth2.googleapis.com/token",
			auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
			client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(clientEmail)}`,
		},
		["https://www.googleapis.com/auth/calendar"],
	);

	const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

	async function fetchWithAuth({
		endpoint,
		options = {},
	}: { endpoint: string; options?: RequestInit }): Promise<Response> {
		const token = await auth.getGoogleAuthToken();
		if (!token) throw new Error("Failed to get Google auth token");
		const headers = new Headers(options.headers);
		headers.set("Authorization", `Bearer ${token}`);

		return fetch(`${CALENDAR_API_BASE}${endpoint}`, {
			...options,
			headers,
		});
	}

	async function listEvents(
		params: Omit<calendar_v3.Params$Resource$Events$List, "calendarId">,
	): Promise<calendar_v3.Schema$Events> {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				searchParams.set(key, value.toString());
			}
		}

		try {
			const response = await fetchWithAuth({
				endpoint: `/calendars/${encodeURIComponent(calendarId)}/events?${searchParams}`,
			});
			if (!response.ok) {
				throw new Error(`${response.statusText} ${await response.text()}`);
			}
			return response.json<calendar_v3.Schema$Events>();
		} catch (error) {
			throw new Error(
				`Failed to list events: ${getMessageFromUnknownError(error)}`,
			);
		}
	}

	async function getEvent(eventId: string): Promise<calendar_v3.Schema$Event> {
		try {
			const response = await fetchWithAuth({
				endpoint: `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
					eventId,
				)}`,
			});
			if (!response.ok) {
				throw new Error(`${response.statusText} ${await response.text()}`);
			}
			return response.json<calendar_v3.Schema$Event>();
		} catch (error) {
			throw new Error(
				`Failed to get event: ${getMessageFromUnknownError(error)}`,
			);
		}
	}

	return {
		listEvents,
		getNextEvent: async (): Promise<calendar_v3.Schema$Event | null> => {
			const now = new Date();

			try {
				const events = await listEvents({
					timeMin: now.toISOString(),
					maxResults: 1,
					singleEvents: true,
					orderBy: "startTime",
				});
				return events.items?.[0] ?? null;
			} catch (error) {
				throw new Error(
					`Failed to get next event: ${getMessageFromUnknownError(error)}`,
				);
			}
		},
		updateEvent: async (
			eventId: string,
			event: Partial<calendar_v3.Schema$Event>,
		): Promise<calendar_v3.Schema$Event> => {
			try {
				const response = await fetchWithAuth({
					endpoint: `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
						eventId,
					)}`,
					options: {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(event),
					},
				});

				if (!response.ok) {
					throw new Error(`${response.statusText} ${await response.text()}`);
				}

				return response.json<calendar_v3.Schema$Event>();
			} catch (error) {
				throw new Error(
					`Failed to update event: ${getMessageFromUnknownError(error)}`,
				);
			}
		},
		isButteryOpen: async (targetTime: Date): Promise<boolean> => {
			const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
			const SEARCH_WINDOW_HOURS = 4;
			try {
				const searchWindowStart = new Date(
					targetTime.getTime() - SEARCH_WINDOW_HOURS * MILLISECONDS_PER_HOUR,
				);
				const searchWindowEnd = new Date(
					targetTime.getTime() + SEARCH_WINDOW_HOURS * MILLISECONDS_PER_HOUR,
				);
				console.log("Searching for Buttery events in time window:", {
					searchWindowStart: searchWindowStart.toISOString(),
					searchWindowEnd: searchWindowEnd.toISOString(),
					targetTime: targetTime.toISOString(),
				});

				const eventsInSearchWindow = await listEvents({
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
		},
	};
}
