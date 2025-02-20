import type { calendar_v3 } from "@googleapis/calendar";
import GoogleAuth from "cloudflare-workers-and-google-oauth";
import { getMessageFromUnknownError } from "../utils";

export type GoogleCalendarService = ReturnType<
	typeof createGoogleCalendarService
>;

export function createGoogleCalendarService({
	clientEmail,
	privateKey,
	calendarId,
}: {
	clientEmail: string;
	privateKey: string;
	calendarId: string;
}) {
	const auth = new GoogleAuth(
		{
			type: "service_account",
			project_id: "butteurbot",
			private_key_id: "",
			client_id: "",
			client_email: clientEmail,
			private_key: privateKey,
			token_uri: "https://oauth2.googleapis.com/token",
			auth_uri: "https://accounts.google.com/o/oauth2/auth",
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

	async function updateEvent(
		eventId: string,
		event: Partial<calendar_v3.Schema$Event>,
	): Promise<calendar_v3.Schema$Event> {
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
		updateEventStatus: async (
			eventId: string,
			status: "confirmed" | "cancelled",
		): Promise<calendar_v3.Schema$Event> => {
			try {
				const event = await getEvent(eventId);
				const updatedEvent = await updateEvent(eventId, {
					...event,
					status,
				} satisfies calendar_v3.Schema$Event);
				return updatedEvent;
			} catch (error) {
				throw new Error(`Error updating event status: ${error}`);
			}
		},
	};
}
