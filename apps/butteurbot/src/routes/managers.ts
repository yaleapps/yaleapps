import { arktypeValidator } from "@hono/arktype-validator";
import { Hono } from "hono";
import type { Bindings } from "..";
import { type GroupMeWebhook, groupMeWebhookPayload } from "../types/groupme";
import type { GoogleCalendarService } from "../services/calendar";

const app = new Hono<{ Bindings: Bindings }>();

const createCommands = (googleCalendarService: GoogleCalendarService) => ({
	"!open": async () => {
		const nextEvent = await googleCalendarService.getNextEvent();
		if (!nextEvent?.id) return "No upcoming events found";

		const success = await googleCalendarService.updateEventStatus(
			nextEvent.id,
			"confirmed",
		);
		if (success) {
			return `Updated event "${nextEvent.summary}" status to confirmed`;
		}
		return "Failed to update event status";
	},
	"!closed": async () => {
		const nextEvent = await googleCalendarService.getNextEvent();
		if (!nextEvent?.id) return "No upcoming events found";

		const success = await googleCalendarService.updateEventStatus(
			nextEvent.id,
			"cancelled",
		);
		if (success) {
			return `Updated event "${nextEvent.summary}" status to cancelled`;
		}
		return "Failed to update event status";
	},
});

app.post("/", arktypeValidator("json", groupMeWebhookPayload), async (c) => {
	const groupMeWebhookPayload = c.req.valid("json");
	const { text, sender_type } = groupMeWebhookPayload;
	const butteurBot = c.get("butteurBot");
	const googleCalendarService = c.get("calendars.gh");
	const commands = createCommands(googleCalendarService);

	try {
		const isMessageFromBot = sender_type === "bot";
		const isEmptyMessage = !text.trim();
		const shouldSkip = isMessageFromBot || isEmptyMessage;

		if (shouldSkip) return c.body(null, 200);

		// Check if the message matches any command
		for (const [command, handler] of Object.entries(commands)) {
			if (text.toLowerCase().startsWith(command)) {
				const response = await handler();
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
