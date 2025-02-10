import { type } from "arktype";

// Base attachment types
const imageAttachment = type({
	type: "'image'",
	url: "string",
});

const locationAttachment = type({
	type: "'location'",
	lat: "string",
	lng: "string",
	name: "string",
});

const splitAttachment = type({
	type: "'split'",
	token: "string",
});

const emojiAttachment = type({
	type: "'emoji'",
	placeholder: "string",
	charmap: "[number, number][]",
});

// Combined attachment type using union
const attachment = type.union([
	imageAttachment,
	locationAttachment,
	splitAttachment,
	emojiAttachment,
]);

export const groupMeWebhook = type({
	id: "string",
	"source_guid?": "string",
	created_at: "number",
	user_id: "string",
	group_id: "string",
	name: "string",
	"avatar_url?": "string",
	text: "string",
	system: "boolean",
	"favorited_by?": "string[]",
	"attachments?": attachment.array(),
	sender_type: "'user' | 'bot' | 'system'",
});

export const groupMeBotMessage = type({
	bot_id: "string",
	text: "string",
	"attachments?": attachment.array(),
	"source_guid?": "string",
});

// Export inferred types if needed
export type GroupMeWebhook = typeof groupMeWebhook.infer;
export type GroupMeBotMessage = typeof groupMeBotMessage.infer;
