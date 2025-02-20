import { arktypeValidator } from "@hono/arktype-validator";
import { Hono } from "hono";
import type { Bindings } from "..";
import { type GroupMeWebhook, groupMeWebhookPayload } from "../types/groupme";

const app = new Hono<{ Bindings: Bindings }>();

app.post(
	"/gh/managers",
	arktypeValidator("json", groupMeWebhookPayload),
	async (c) => {
		const groupMeWebhookPayload = c.req.valid("json");
		const { text, sender_type } = groupMeWebhookPayload;
		const { groupMeBots, butterySchedules } = c.var.services;

		const ghManagerCommands = {
			"!open": async () => {
				try {
					await butterySchedules.gh.markNextShiftAs("open");
					await groupMeBots["gh.managers"].sendGroupMeMessage(
						"Marked as open!",
					);
				} catch (error) {
					console.error("Error updating event status:", error);
					await groupMeBots["gh.managers"].sendGroupMeMessage(
						"Error marking next shift as open. Please try again.",
					);
				}
			},
			"!closed": async () => {
				try {
					await butterySchedules.gh.markNextShiftAs("closed");
					await groupMeBots["gh.managers"].sendGroupMeMessage(
						"Marked as closed!",
					);
				} catch (error) {
					console.error("Error updating event status:", error);
					await groupMeBots["gh.managers"].sendGroupMeMessage(
						"Error marking next shift as closed. Please try again.",
					);
				}
			},
		};

		try {
			const isMessageFromBot = sender_type === "bot";
			const isEmptyMessage = !text.trim();
			const shouldSkip = isMessageFromBot || isEmptyMessage;

			if (shouldSkip) return c.body(null, 200);

			// Check if the message matches any command
			for (const [command, handler] of Object.entries(ghManagerCommands)) {
				if (text.toLowerCase().startsWith(command)) {
					await handler();
					return c.body(null, 200);
				}
			}

			return c.body(null, 200);
		} catch (error) {
			console.error("Error processing GroupMe webhook:", error);
			return c.body(null, 200);
		}
	},
);

app.post("/listen", async (c) => {
	try {
		const { text: input, sender_type } = await c.req.json<GroupMeWebhook>();
		const { groupMeBots } = c.var.services;

		const markAsOpen = async (message: string) => {
			try {
				await groupMeBots["gh.managers"].sendGroupMeMessage(
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
				await groupMeBots["gh.managers"].sendGroupMeMessage(
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
