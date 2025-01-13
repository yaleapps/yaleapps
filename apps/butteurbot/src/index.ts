import { Hono } from "hono";
import { google } from "googleapis";

const auth = new google.auth.JWT({
	email: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_EMAIL,
	key: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
	scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

const app = new Hono();

async function getNextEvent(calendarId: string) {
	const now = new Date();

	try {
		const response = await calendar.events.list({
			calendarId,
			timeMin: now.toISOString(),
			maxResults: 1,
			singleEvents: true,
			orderBy: "startTime",
		});

		return response.data.items?.[0] ?? null;
	} catch (error) {
		console.error("Error fetching next event:", error);
		return null;
	}
}

async function updateEventStatus(
	calendarId: string,
	eventId: string,
	status: "confirmed" | "cancelled",
) {
	try {
		const event = await calendar.events.get({ calendarId, eventId });

		const updatedEvent = { ...event.data, status };

		await calendar.events.update({
			calendarId,
			eventId,
			requestBody: updatedEvent,
		});

		return true;
	} catch (error) {
		console.error("Error updating event status:", error);
		return false;
	}
}

const commands = {
	"!open": async (calendarId: string) => {
		const nextEvent = await getNextEvent(calendarId);
		if (!nextEvent?.id) return "No upcoming events found";

		const success = await updateEventStatus(
			calendarId,
			nextEvent.id,
			"confirmed",
		);
		if (success) {
			return `Updated event "${nextEvent.summary}" status to confirmed`;
		}
		return "Failed to update event status";
	},
	"!closed": async (calendarId: string) => {
		const nextEvent = await getNextEvent(calendarId);
		if (!nextEvent?.id) return "No upcoming events found";

		const success = await updateEventStatus(
			calendarId,
			nextEvent.id,
			"cancelled",
		);
		if (success) {
			return `Updated event "${nextEvent.summary}" status to cancelled`;
		}
		return "Failed to update event status";
	},
};

interface GroupMeWebhook {
	text: string;
	sender_type: string;
	name?: string;
	group_id: string;
}

interface GroupMeBotMessage {
	bot_id: string;
	text: string;
}

async function sendGroupMeMessage(text: string) {
	const botId = process.env.GROUPME_BOT_ID;
	if (!botId) {
		console.error("GroupMe Bot ID not configured");
		return;
	}

	try {
		await fetch("https://api.groupme.com/v3/bots/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				bot_id: botId,
				text,
			} satisfies GroupMeBotMessage),
		});
	} catch (error) {
		console.error("Error sending GroupMe message:", error);
	}
}

app.post("/gh/managers", async (c) => {
	try {
		const { text: input, sender_type } = await c.req.json<GroupMeWebhook>();

		const isMessageFromBot = sender_type === "bot";
		if (isMessageFromBot) return c.body(null, 200);

		const isEmptyMessage = !input.trim();
		if (isEmptyMessage) return c.body(null, 200);

		// Get the calendar ID from environment variable
		const calendarId = process.env.BUTTEURBOT_CALENDAR_ID;
		if (!calendarId) {
			console.error("Calendar ID not configured");
			return c.body(null, 200);
		}

		// Check if the message matches any command
		for (const [command, handler] of Object.entries(commands)) {
			if (input.toLowerCase().startsWith(command)) {
				const response = await handler(calendarId);
				// Send the response back to the GroupMe chat
				await sendGroupMeMessage(response);
				return c.body(null, 200);
			}
		}

		// No command matched
		return c.body(null, 200);
	} catch (error) {
		console.error("Error processing GroupMe webhook:", error);
		return c.body(null, 200);
	}
});

export default app;
