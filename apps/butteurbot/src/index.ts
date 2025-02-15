import { Hono } from "hono";
import managers from "./routes/managers";
import scheduled from "./routes/scheduled";
import { type GoogleCalendar, googleCalendar } from "./services/calendar";
import { butteurBot, type GroupMeBot } from "./services/groupme";

export type Bindings = {
	GRACE_HOPPER_CALENDAR_ID: string;
	GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
	GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
};

declare module "hono" {
	interface ContextVariableMap {
		calendar: GoogleCalendar;
		butteurBot: GroupMeBot;
	}
}

export const app = new Hono<{ Bindings: Bindings }>();

app.use(googleCalendar);
app.use(butteurBot);

app.route("/scheduled", scheduled);
app.route("/webhooks/gh/managers", managers);

// Listen for messages from managers that hint at the Buttery being open or closed for the day. If so, ask them to confirm
// app.post("/gh/managers/listen", async (c) => {
// 	try {
// 		const { text: input, sender_type } = await c.req.json<GroupMeWebhook>();

// 		const shouldIgnoreMessage = sender_type === "bot" || !input.trim();
// 		if (shouldIgnoreMessage) return c.body(null, 200);

// 		const messageText = input.trim().toLowerCase();

// 		const containsOpen = messageText.includes("open");
// 		const containsClose = messageText.includes("close");

// 		if (containsOpen) {
// 			await markAsOpen(messageText);
// 		} else if (containsClose) {
// 			await markAsClosed(messageText);
// 		}

// 		return c.body(null, 200);
// 	} catch (error) {
// 		console.error("Error processing GroupMe webhook:", error);
// 		return c.body(null, 200);
// 	}
// });

export default app;
