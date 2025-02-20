import { createMiddleware } from "hono/factory";
import type { GroupMeBotMessage } from "../types/groupme";
import type { Bindings } from "..";
import type { Context } from "hono";

export const butteurBot = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		c.set("groupmeBots", createGroupMeBots(c));
		await next();
	},
);

export type GroupMeBots = ReturnType<typeof createGroupMeBots>;

function createGroupMeBots(c: Context<{ Bindings: Bindings }>) {
	return {
		gh: {
			managers: createGroupMeBot(c.env.GROUPME_GH_MANAGERS_BOT_ID),
			students: createGroupMeBot(c.env.GROUPME_GH_STUDENTS_BOT_ID),
		},
	};
}

export type GroupMeBot = ReturnType<typeof createGroupMeBot>;

export function createGroupMeBot(botId: string) {
	return {
		sendGroupMeMessage: async (text: string) => {
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
		},
	};
}
