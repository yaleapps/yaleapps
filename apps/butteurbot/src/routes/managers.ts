import { Hono } from "hono";
import type { GroupMeWebhook } from "../types/groupme";
import type { GoogleCalendar } from "../services/calendar";
import type { Bindings } from "..";

const createCommands = (googleCalendar: GoogleCalendar) => ({
	"!open": async (calendarId: string) => {
		const nextEvent = await googleCalendar.getNextEvent(calendarId);
		if (!nextEvent?.id) return "No upcoming events found";

		const success = await googleCalendar.updateEventStatus(
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
		const nextEvent = await googleCalendar.getNextEvent(calendarId);
		if (!nextEvent?.id) return "No upcoming events found";

		const success = await googleCalendar.updateEventStatus(
			calendarId,
			nextEvent.id,
			"cancelled",
		);
		if (success) {
			return `Updated event "${nextEvent.summary}" status to cancelled`;
		}
		return "Failed to update event status";
	},
});

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
	const butteurBot = c.get("butteurBot");
	const googleCalendar = c.get("calendar");
	const commands = createCommands(googleCalendar);
	try {
		const { text: input, sender_type } = await c.req.json<GroupMeWebhook>();

		const isMessageFromBot = sender_type === "bot";
		if (isMessageFromBot) return c.body(null, 200);

		const isEmptyMessage = !input.trim();
		if (isEmptyMessage) return c.body(null, 200);

		// Check if the message matches any command
		for (const [command, handler] of Object.entries(commands)) {
			if (input.toLowerCase().startsWith(command)) {
				const response = await handler(c.env.GRACE_HOPPER_CALENDAR_ID);
				await butteurBot.sendGroupMeMessage(response);
				return c.body(null, 200);
			}
		}

		return c.body(null, 200);
	} catch (error) {
		console.error("Error processing GroupMe webhook:", error);
		return c.body(null, 200);
	}
});

app.post("/listen", async (c) => {
	try {
		const { text: input, sender_type } = await c.req.json<GroupMeWebhook>();
		const butteurBot = c.get("butteurBot");

		const markAsOpen = async (message: string) => {
			try {
				await butteurBot.sendGroupMeMessage(
					`Marking as open based on message: "${message}"`,
				);
				return true;
			} catch (error) {
				console.error("Error marking as open:", error);
				return false;
			}
		};

		const markAsClosed = async (message: string) => {
			try {
				await butteurBot.sendGroupMeMessage(
					`Marking as closed based on message: "${message}"`,
				);
				return true;
			} catch (error) {
				console.error("Error marking as closed:", error);
				return false;
			}
		};

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

export default app;
