import { Hono } from "hono";
import scheduled from "./routes/scheduled";
import webhooks from "./routes/webhooks";
import { servicesMiddleware } from "./services";

export type Bindings = {
	CALENDAR_ID_GH: string;
	GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string;
	GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string;
	GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string;
	GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
	GROUPME_GH_MANAGERS_BOT_ID: string;
	GROUPME_GH_STUDENTS_BOT_ID: string;
};

export const app = new Hono<{ Bindings: Bindings }>();

app.use(servicesMiddleware);

app.route("/scheduled", scheduled);
app.route("/webhooks", webhooks);

export default app;
