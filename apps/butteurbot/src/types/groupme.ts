export type GroupMeWebhook = {
	id: string;
	source_guid?: string;
	created_at: number;
	user_id: string;
	group_id: string;
	name: string;
	avatar_url?: string;
	text: string;
	system: boolean;
	favorited_by?: string[];
	attachments?: Array<
		| {
				type: "image";
				url: string;
		  }
		| {
				type: "location";
				lat: string;
				lng: string;
				name: string;
		  }
		| {
				type: "split";
				token: string;
		  }
		| {
				type: "emoji";
				placeholder: string;
				charmap: [number, number][];
		  }
	>;
	sender_type: "user" | "bot" | "system";
};

export type GroupMeBotMessage = {
	bot_id: string;
	text: string;
	attachments?: GroupMeWebhook["attachments"];
	source_guid?: string;
};
