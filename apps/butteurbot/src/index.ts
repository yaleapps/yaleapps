import { Hono } from "hono";
import scheduled from "./routes/scheduled";
import webhooks from "./routes/webhooks";
import { servicesMiddleware } from "./services";

export type Bindings = {
	CALENDAR_ID_GH: string;
	GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
	GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
	GROUPME_GH_MANAGERS_BOT_ID: string;
	GROUPME_GH_STUDENTS_BOT_ID: string;
};

export const app = new Hono<{ Bindings: Bindings }>();

app.use(servicesMiddleware);

app.route("/scheduled", scheduled);
app.route("/webhooks", webhooks);
// app.route("/webhooks/gh/students", students);

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
