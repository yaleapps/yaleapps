import type { calendar_v3 } from "@googleapis/calendar";
import GoogleAuth from "cloudflare-workers-and-google-oauth";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "..";

export const googleCalendarService = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		c.set(
			"services.googleCalendar",
			createGoogleCalendarService({
				clientEmail: c.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
				privateKey: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
			}),
		);
		await next();
	},
);

export type GoogleCalendarService = ReturnType<
	typeof createGoogleCalendarService
>;

function createGoogleCalendarService({
	clientEmail,
	privateKey,
}: {
	clientEmail: string;
	privateKey: string;
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
		calendarId: string,
		params: Omit<calendar_v3.Params$Resource$Events$List, "calendarId">,
	): Promise<calendar_v3.Schema$Events> {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				searchParams.set(key, value.toString());
			}
		}

		const response = await fetchWithAuth({
			endpoint: `/calendars/${encodeURIComponent(calendarId)}/events?${searchParams}`,
		});

		if (!response.ok) {
			throw new Error(`Failed to list events: ${response.statusText}`);
		}

		return response.json<calendar_v3.Schema$Events>();
	}

	async function getEvent(
		calendarId: string,
		eventId: string,
	): Promise<calendar_v3.Schema$Event> {
		const response = await fetchWithAuth({
			endpoint: `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
				eventId,
			)}`,
		});

		if (!response.ok) {
			throw new Error(`Failed to get event: ${response.statusText}`);
		}

		return response.json<calendar_v3.Schema$Event>();
	}

	async function updateEvent(
		calendarId: string,
		eventId: string,
		event: Partial<calendar_v3.Schema$Event>,
	): Promise<calendar_v3.Schema$Event> {
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
			throw new Error(`Failed to update event: ${response.statusText}`);
		}

		return response.json<calendar_v3.Schema$Event>();
	}

	return {
		listEvents,
		getNextEvent: async (
			calendarId: string,
		): Promise<calendar_v3.Schema$Event | null> => {
			try {
				const now = new Date();

				const events = await listEvents(calendarId, {
					timeMin: now.toISOString(),
					maxResults: 1,
					singleEvents: true,
					orderBy: "startTime",
				});

				return events.items?.[0] ?? null;
			} catch (error) {
				console.error("Error fetching next event:", error);
				return null;
			}
		},
		updateEventStatus: async (
			calendarId: string,
			eventId: string,
			status: "confirmed" | "cancelled",
		): Promise<boolean> => {
			try {
				const event = await getEvent(calendarId, eventId);
				const updatedEvent = await updateEvent(calendarId, eventId, {
					...event,
					status,
				} satisfies calendar_v3.Schema$Event);
				return !!updatedEvent;
			} catch (error) {
				console.error("Error updating event status:", error);
				return false;
			}
		},
	};
}
