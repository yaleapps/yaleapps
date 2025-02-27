import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "..";
import type { GroupMeBotMessage } from "../types/groupme";
import { createButteryScheduleService } from "./butterySchedule";
import { createGoogleCalendarService } from "./calendar";

declare module "hono" {
	interface ContextVariableMap {
		services: Services;
	}
}

export const servicesMiddleware = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		c.set("services", createServices(c));
		await next();
	},
);

type Services = ReturnType<typeof createServices>;

function createServices(c: Context<{ Bindings: Bindings }>) {
	return {
		groupMeBots: {
			"gh.managers": createGroupMeBot(c.env.GROUPME_GH_MANAGERS_BOT_ID),
			"gh.students": createGroupMeBot(c.env.GROUPME_GH_STUDENTS_BOT_ID),
		},
		butterySchedules: {
			gh: createButteryScheduleService(
				createGoogleCalendarService({
					clientEmail: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
					clientId: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
					privateKeyId: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
					privateKey: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
					calendarId: c.env.CALENDAR_ID_GH,
				}),
			),
		},
	};
}

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
