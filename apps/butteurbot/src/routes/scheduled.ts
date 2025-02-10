import { Hono } from "hono";
import { isButteryOpen } from "../isButteryOpen";
import { sendGroupMeMessage } from "../services/groupme";
import { getCurrentEasternHour } from "../utils/time";

export const scheduledRoutes = new Hono().get("/", async (c) => {
	const currentEasternHour = getCurrentEasternHour();
	const is4pm = currentEasternHour === 16;
	const is10pm = currentEasternHour === 22;

	if (is4pm) {
		await requestConfirmationFromManagers();
	} else if (is10pm) {
		await sendStatusToStudents();
	}

	return c.text("Scheduled task completed successfully");
});

async function requestConfirmationFromManagers() {
	await sendGroupMeMessage(
		"Managers: Please confirm if the Buttery will be open tonight. Use !open or !closed to update the status.",
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
