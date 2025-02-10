import { Hono } from "hono";
import { isButteryOpen } from "../isButteryOpen";
import { sendGroupMeMessage } from "../services/groupme";
import { getCurrentEasternHour } from "../utils/time";

/**
 * Scheduled route handler that manages automated Buttery status checks and notifications.
 * This route is triggered by Cloudflare Workers cron triggers defined in {@link ../wrangler.toml}
 *
 * The route performs different actions based on the current Eastern time:
 * - At 4:00 PM: Sends a message to managers requesting confirmation of Buttery status
 * - At 10:00 PM: Checks calendar and sends the final status to all students
 */
export const scheduledRoute = new Hono().get("/", async (c) => {
	const currentEasternHour = getCurrentEasternHour();
	const is4pm = currentEasternHour === 16;
	const is10pm = currentEasternHour === 22;

	if (is4pm) {
		await requestManagerConfirmation();
	} else if (is10pm) {
		await sendStatusToStudents();
	}

	return c.text("Scheduled task completed successfully");
});

async function requestManagerConfirmation() {
	await sendGroupMeMessage(
		"Is the buttery open tonight? 🍔\n\n🚨 MANAGERS: Please confirm if the Buttery will be open by responding with:\n!open\n!closed",
	);
}

async function sendStatusToStudents() {
	const calendarId = process.env.BUTTEURBOT_CALENDAR_ID;
	if (!calendarId) {
		console.error("Calendar ID not configured");
		return;
	}

	const isOpen = await isButteryOpen({
		calendarId,
		timeToCheck: new Date(),
	});

	const message = isOpen
		? "The Buttery is OPEN tonight!"
		: "The Buttery is CLOSED tonight.";
	await sendGroupMeMessage(message);
}
