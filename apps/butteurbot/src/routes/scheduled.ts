import { Hono } from "hono";
import type { Bindings } from "..";
import { isButteryOpen } from "../isButteryOpen";
import { getCurrentEasternHour } from "../utils";

const app = new Hono<{ Bindings: Bindings }>();

/**
 * Scheduled route handler that manages automated Buttery status checks and notifications.
 * This route is triggered by Cloudflare Workers cron triggers defined in [wrangler.toml](../../wrangler.toml)
 *
 * The route performs different actions based on the current Eastern time:
 * - At 4:00 PM: Sends a message to managers requesting confirmation of Buttery status
 * - At 10:00 PM: Checks calendar and sends the final status to all students
 */
app.get("/", async (c) => {
	const googleCalendarService = c.get("calendars.gh");
	const groupmeBots = c.get("groupmeBots");

	const currentEasternHour = getCurrentEasternHour();
	const is4pm = currentEasternHour === 16;
	const is10pm = currentEasternHour === 22;

	if (is4pm) {
		const requestManagerConfirmation = async () => {
			await groupmeBots["gh.managers"].sendGroupMeMessage(
				"Is the buttery open tonight? 🍔\n\n🚨 MANAGERS: Please confirm if the Buttery will be open by responding with:\n!open\n!closed",
			);
		};
		await requestManagerConfirmation();
	} else if (is10pm) {
		const sendStatusToStudents = async () => {
			const isOpen = await isButteryOpen(googleCalendarService, {
				calendarId: c.env.CALENDAR_ID_GH,
				targetTime: new Date(),
			});
			const message = isOpen
				? "The Buttery is OPEN tonight!"
				: "The Buttery is CLOSED tonight.";
			await groupmeBots["gh.students"].sendGroupMeMessage(message);
		};
		await sendStatusToStudents();
	}

	return c.text("Scheduled task completed successfully");
});

export default app;
