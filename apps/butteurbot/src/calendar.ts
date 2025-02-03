import type { calendar_v3 } from "@googleapis/calendar";
import type { GoogleAuth } from "./auth";

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export class GoogleCalendar {
	private auth: GoogleAuth;

	constructor(auth: GoogleAuth) {
		this.auth = auth;
	}

	private async fetchWithAuth(
		endpoint: string,
		options: RequestInit = {},
	): Promise<Response> {
		const token = await this.auth.getAccessToken();
		const headers = new Headers(options.headers);
		headers.set("Authorization", `Bearer ${token}`);

		return fetch(`${CALENDAR_API_BASE}${endpoint}`, {
			...options,
			headers,
		});
	}

	async listEvents(
		calendarId: string,
		params: {
			timeMin?: string;
			timeMax?: string;
			maxResults?: number;
			orderBy?: "startTime" | "updated";
			singleEvents?: boolean;
		} = {},
	): Promise<calendar_v3.Schema$Events> {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				searchParams.set(key, value.toString());
			}
		}

		const response = await this.fetchWithAuth(
			`/calendars/${encodeURIComponent(calendarId)}/events?${searchParams}`,
		);

		if (!response.ok) {
			throw new Error(`Failed to list events: ${response.statusText}`);
		}

		return response.json<calendar_v3.Schema$Events>();
	}

	async getEvent(
		calendarId: string,
		eventId: string,
	): Promise<calendar_v3.Schema$Event> {
		const response = await this.fetchWithAuth(
			`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
				eventId,
			)}`,
		);

		if (!response.ok) {
			throw new Error(`Failed to get event: ${response.statusText}`);
		}

		return response.json<calendar_v3.Schema$Event>();
	}

	async updateEvent(
		calendarId: string,
		eventId: string,
		event: Partial<calendar_v3.Schema$Event>,
	): Promise<calendar_v3.Schema$Event> {
		const response = await this.fetchWithAuth(
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
	}
}
