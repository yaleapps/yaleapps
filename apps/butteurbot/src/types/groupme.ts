import { type } from "arktype";

export const groupMeWebhookPayload = type({
	attachments: [
		type({
			type: "'image'",
			url: "string",
		})
			.or({
				type: "'video'",
				url: "string",
				preview_url: "string",
			})
			.or({
				type: "'file'",
				file_id: "string",
			})
			.or({
				type: "'location'",
				name: "string",
				lat: "string",
				lng: "string",
			})
			.or({
				type: "'emoji'",
				placeholder: "string",
				charmap: [["number", "number"], "[]"],
			}),
		"[]",
	],
	avatar_url: "string.url",
	created_at: "number",
	group_id: "string",
	source_guid: "string",
	id: "string",
	name: "string",
	sender_type: "'user' | 'bot' | 'system'",
	system: "boolean",
	text: "string",
	user_id: "string",
});

export const groupMeBotMessage = type({
	bot_id: "string",
	text: "string",
});

// Export inferred types if needed
export type GroupMeWebhook = typeof groupMeWebhookPayload.infer;
export type GroupMeBotMessage = typeof groupMeBotMessage.infer;
