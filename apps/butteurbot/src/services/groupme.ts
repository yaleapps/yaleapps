import type { GroupMeBotMessage } from "../types/groupme";

export async function sendGroupMeMessage(text: string) {
	const botId = process.env.GROUPME_BOT_ID;
	if (!botId) {
		console.error("GroupMe Bot ID not configured");
		return;
	}

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
}
