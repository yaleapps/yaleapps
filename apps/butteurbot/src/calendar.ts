import type { calendar_v3 } from "@googleapis/calendar";
import type GoogleAuth from "cloudflare-workers-and-google-oauth";

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export function createGoogleCalendar(auth: GoogleAuth) {
	async function fetchWithAuth(
		endpoint: string,
		options: RequestInit = {},
	): Promise<Response> {
		const token = await auth.getGoogleAuthToken();
		if (!token) throw new Error("Failed to get Google auth token");
		const headers = new Headers(options.headers);
		headers.set("Authorization", `Bearer ${token}`);

		return fetch(`${CALENDAR_API_BASE}${endpoint}`, {
			...options,
			headers,
		});
	}

	return {
		async listEvents(
			calendarId: string,
			params: {
				timeMin: string;
				timeMax: string;
				maxResults?: number;
				orderBy: "startTime" | "updated";
				singleEvents: boolean;
			},
		): Promise<calendar_v3.Schema$Events> {
			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					searchParams.set(key, value.toString());
				}
			}

			const response = await fetchWithAuth(
				`/calendars/${encodeURIComponent(calendarId)}/events?${searchParams}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to list events: ${response.statusText}`);
			}

			return response.json<calendar_v3.Schema$Events>();
		},

		async getEvent(
			calendarId: string,
			eventId: string,
		): Promise<calendar_v3.Schema$Event> {
			const response = await fetchWithAuth(
				`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
					eventId,
				)}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to get event: ${response.statusText}`);
			}

			return response.json<calendar_v3.Schema$Event>();
		},

		async updateEvent(
			calendarId: string,
			eventId: string,
			event: Partial<calendar_v3.Schema$Event>,
		): Promise<calendar_v3.Schema$Event> {
			const response = await fetchWithAuth(
				`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
					eventId,
				)}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(event),
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to update event: ${response.statusText}`);
			}

			return response.json<calendar_v3.Schema$Event>();
		},
	};
}
