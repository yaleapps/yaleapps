import { z } from "zod";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";

export const userIdSchema = z.string().brand("UserId");

export type UserId = z.infer<typeof userIdSchema>;

const preferenceSchema = z.object({
	value: z.enum(["like", "dislike"]),
	expiresAt: z.date(),
});
export type PreferenceValue = z.infer<typeof preferenceSchema>;

export const lobbyParticipantSchema = z.object({
	userId: userIdSchema,
	profile: lobbyProfileFormSchema,
	preferences: z.record(userIdSchema, preferenceSchema),
});

export type LobbyParticipant = z.infer<typeof lobbyParticipantSchema>;

export const wsMessageInSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("JOIN"), userId: userIdSchema }),
	z.object({ type: z.literal("LEAVE"), userId: userIdSchema }),
	z.object({ type: z.literal("GET_LOBBY") }),
]);

export const wsMessageOutSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("LOBBY_UPDATE"),
		lobby: z.array(lobbyParticipantSchema),
	}),
	z.object({ type: z.literal("ERROR"), error: z.string() }),
]);

export type WsMessageIn = z.infer<typeof wsMessageInSchema>;
export type WsMessageOut = z.infer<typeof wsMessageOutSchema>;

export function createLobbyWsService<T extends WebSocket>(ws: T) {
	const wsSend = (message: WsMessageOut) => {
		ws.send(JSON.stringify(message));
	};

	return {
		sendLobbyUpdate: (lobby: LobbyParticipant[]) =>
			wsSend({ type: "LOBBY_UPDATE", lobby }),
		sendError: (error: string) => wsSend({ type: "ERROR", error }),
	};
}
