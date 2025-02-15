import { createMiddleware } from "hono/factory";
import type { GroupMeBotMessage } from "../types/groupme";
import type { Bindings } from "..";

export const butteurBot = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		c.set("butteurBot", createGroupMeBot(c.env.BUTTEURBOT_GROUPME_BOT_ID));
		await next();
	},
);

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
