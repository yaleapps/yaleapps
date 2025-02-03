// Google Calendar API Types
// Based on https://developers.google.com/calendar/api/v3/reference/events

export interface CalendarEvent {
	kind: "calendar#event";
	etag?: string;
	id?: string;
	status?: "confirmed" | "tentative" | "cancelled";
	htmlLink?: string;
	created?: string;
	updated?: string;
	summary?: string;
	description?: string;
	location?: string;
	creator?: {
		id?: string;
		email?: string;
		displayName?: string;
		self?: boolean;
	};
	organizer?: {
		id?: string;
		email?: string;
		displayName?: string;
		self?: boolean;
	};
	start?: {
		date?: string;
		dateTime?: string;
		timeZone?: string;
	};
	end?: {
		date?: string;
		dateTime?: string;
		timeZone?: string;
	};
	recurringEventId?: string;
	originalStartTime?: {
		date?: string;
		dateTime?: string;
		timeZone?: string;
	};
	transparency?: "opaque" | "transparent";
	visibility?: "default" | "public" | "private" | "confidential";
	iCalUID?: string;
	sequence?: number;
	attendees?: Array<{
		id?: string;
		email?: string;
		displayName?: string;
		organizer?: boolean;
		self?: boolean;
		resource?: boolean;
		optional?: boolean;
		responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
		comment?: string;
		additionalGuests?: number;
	}>;
	reminders?: {
		useDefault?: boolean;
		overrides?: Array<{
			method?: string;
			minutes?: number;
		}>;
	};
}

export interface CalendarEventList {
	kind: "calendar#events";
	etag?: string;
	summary?: string;
	description?: string;
	updated?: string;
	timeZone?: string;
	accessRole?: string;
	defaultReminders?: Array<{
		method?: string;
		minutes?: number;
	}>;
	nextPageToken?: string;
	nextSyncToken?: string;
	items?: CalendarEvent[];
}

export interface CalendarError {
	error: {
		code: number;
		message: string;
		errors: Array<{
			domain: string;
			reason: string;
			message: string;
		}>;
	};
}

// JWT Types
export interface JWTHeader {
	alg: "RS256";
	typ: "JWT";
}

export interface JWTPayload {
	iss: string;
	scope: string;
	aud: string;
	exp: number;
	iat: number;
}

export interface ServiceAccountCredentials {
	email: string;
	key: string;
	scopes: string[];
}
