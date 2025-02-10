export type GroupMeWebhook = {
	text: string;
	sender_type: string;
	name?: string;
	group_id: string;
};

export type GroupMeBotMessage = {
	bot_id: string;
	text: string;
};
