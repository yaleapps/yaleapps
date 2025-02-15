import { Hono } from "hono";
import { google } from "googleapis";
import type { GroupMeBotMessage, GroupMeWebhook } from "./types/groupme";
import { isButteryOpen } from "./isButteryOpen";
import { scheduledRoute } from "./routes/scheduled";
import { managersRoutes } from "./routes/managers";

const auth = new google.auth.JWT({
	email: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_EMAIL,
	key: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
	scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

const app = new Hono();

app.route("/scheduled", scheduledRoute);
app.route("/gh/managers", managersRoutes);

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

// Listen for messages from managers that hint at the Buttery being open or closed for the day. If so, ask them to confirm
app.post("/gh/managers/listen", async (c) => {
	try {
		const { text: input, sender_type } = await c.req.json<GroupMeWebhook>();

		const shouldIgnoreMessage = sender_type === "bot" || !input.trim();
		if (shouldIgnoreMessage) return c.body(null, 200);

		const messageText = input.trim().toLowerCase();

		const containsOpen = messageText.includes("open");
		const containsClose = messageText.includes("close");

		if (containsOpen) {
			await markAsOpen(messageText);
		} else if (containsClose) {
			await markAsClosed(messageText);
		}

		return c.body(null, 200);
	} catch (error) {
		console.error("Error processing GroupMe webhook:", error);
		return c.body(null, 200);
	}
});

async function markAsOpen(message: string) {
	try {
		// TODO: Implement the logic for marking as open
		await sendGroupMeMessage(`Marking as open based on message: "${message}"`);
		return true;
	} catch (error) {
		console.error("Error marking as open:", error);
		return false;
	}
}

async function markAsClosed(message: string) {
	try {
		// TODO: Implement the logic for marking as closed
		await sendGroupMeMessage(
			`Marking as closed based on message: "${message}"`,
		);
		return true;
	} catch (error) {
		console.error("Error marking as closed:", error);
		return false;
	}
}

export default app;
