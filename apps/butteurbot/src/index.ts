import { Hono } from "hono";
import webhooks from "./routes/webhooks";
import { createServices, servicesMiddleware } from "./services";

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

app.route("/webhooks", webhooks);

export default {
	fetch: app.fetch,

	scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
		/**
		 * Scheduled route handler that manages automated Buttery status checks and notifications.
		 * This route is triggered by Cloudflare Workers cron triggers defined in [wrangler.toml](../../wrangler.toml)
		 *
		 * The route performs different actions based on the current Eastern time:
		 * - At 4:00 PM: Sends a message to managers requesting confirmation of Buttery status
		 * - At 10:00 PM: Checks calendar and sends the final status to all students
		 */
		const cronTask = async () => {
			const { butterySchedules, groupMeBots } = createServices(env);

			const currentEasternHour = getCurrentEasternHour();
			const is4pm = currentEasternHour === 16;
			const is10pm = currentEasternHour === 22;

			if (is4pm) {
				const requestManagerConfirmation = async () => {
					await groupMeBots["gh.managers"].sendGroupMeMessage(
						"Is the buttery open tonight? Please confirm by responding with !open or !closed and I'll forward it to the GroupMe!",
					);
				};
				await requestManagerConfirmation();
			} else if (is10pm) {
				const sendStatusToStudents = async () => {
					const message = await butterySchedules.gh.getButteryScheduleMessage();
					await groupMeBots["gh.students"].sendGroupMeMessage(message);
				};
				await sendStatusToStudents();
			}
		};

		ctx.waitUntil(cronTask());
	},
};

/**
 * Get the current hour in Eastern Time (automatically handles EDT/EST)
 */
function getCurrentEasternHour(): number {
	return Number.parseInt(
		new Intl.DateTimeFormat("en-US", {
			timeZone: "America/New_York",
			hour: "numeric",
			hour12: false,
		}).format(new Date()),
	);
}
