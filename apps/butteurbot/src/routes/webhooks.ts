import { tz } from "@date-fns/tz";
import { arktypeValidator } from "@hono/arktype-validator";
import { format } from "date-fns";
import { Hono } from "hono";
import type { Env } from "..";
import { groupMeWebhookPayload } from "../types/groupme";

const app = new Hono<Env>();

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
					const updatedNextShift =
						await butterySchedules.gh.markNextShiftAs("OPEN");

					await groupMeBots["gh.students"].sendGroupMeMessage(
						"The buttery was just confirmed as open for today by the buttery team!",
					);

					if (!updatedNextShift?.start?.dateTime) {
						return "Marked next shift as open! (Date information unavailable)";
					}

					const formattedDateTime = format(
						new Date(updatedNextShift.start.dateTime),
						"MMMM d 'at' p",
						{ in: tz("America/New_York") },
					);

					return `Marked next shift on ${formattedDateTime} as open!

See the updated shift on calendar: ${updatedNextShift.htmlLink}`;
				} catch (error) {
					console.error("Error updating event status:", error);
					return "Error marking next shift as open. Please try again.";
				}
			},
			"!closed": async () => {
				try {
					const updatedNextShift =
						await butterySchedules.gh.markNextShiftAs("CLOSED");

					await groupMeBots["gh.students"].sendGroupMeMessage(
						"The buttery was just confirmed as closed for today by the buttery team!",
					);

					if (!updatedNextShift?.start?.dateTime) {
						return "Marked next shift as closed! (Date information unavailable)";
					}

					const formattedDateTime = format(
						new Date(updatedNextShift.start.dateTime),
						"MMMM d 'at' p",
						{ in: tz("America/New_York") },
					);

					return `Marked next shift on ${formattedDateTime} as closed!

See the updated shift on calendar: ${updatedNextShift.htmlLink}`;
				} catch (error) {
					console.error("Error updating event status:", error);
					return "Error marking next shift as closed. Please try again.";
				}
			},
			"!help": async () => {
				return "Available commands:\n!open (mark next shift as confirmed open)\n!closed (mark next shift as confirmed closed)";
			},
		};

		try {
			const isMessageFromBot = sender_type === "bot";
			const isEmptyMessage = !text.trim();
			const shouldSkip = isMessageFromBot || isEmptyMessage;

			if (shouldSkip) return c.body(null, 200);

			for (const [command, handler] of Object.entries(ghManagerCommands)) {
				if (text.toLowerCase().startsWith(command)) {
					const msg = await handler();
					await groupMeBots["gh.managers"].sendGroupMeMessage(msg);
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

app.post(
	"/gh/students",
	arktypeValidator("json", groupMeWebhookPayload),
	async (c) => {
		const groupMeWebhookPayload = c.req.valid("json");

		if (groupMeWebhookPayload.sender_type !== "user") return c.body(null, 200);

		const isAskingOpen = (
			[
				"is the buttery open",
				"is buttery open",
				"is the buttery closed",
				"is buttery closed",
			] as const
		).some((keyword) =>
			groupMeWebhookPayload.text.toLowerCase().includes(keyword),
		);

		if (isAskingOpen) {
			const message =
				await c.var.services.butterySchedules.gh.getButteryScheduleMessage();
			await c.var.services.groupMeBots["gh.students"].sendGroupMeMessage(
				message,
			);
			return c.body(null, 200);
		}

		return c.body(null, 200);
	},
);

export default app;
