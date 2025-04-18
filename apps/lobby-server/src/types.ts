import { z } from "zod";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";

export const userIdSchema = z.string().brand<"UserId">();
export type UserId = z.infer<typeof userIdSchema>;

export const lobbyParticipantSchema = z.object({
	userId: userIdSchema,
	profile: lobbyProfileFormSchema,
	joinedAt: z.number(),
});

export type LobbyParticipant = z.infer<typeof lobbyParticipantSchema>;

export const wsMessageInSchema = z.discriminatedUnion("type", [
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
