import { z } from "zod";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";

export const userIdSchema = z.string().brand("UserId");

export type UserId = z.infer<typeof userIdSchema>;

export const lobbyParticipantSchema = z.object({
	userId: userIdSchema,
	profile: lobbyProfileFormSchema,
	preferences: z.record(userIdSchema, z.boolean()),
});

export type LobbyParticipant = z.infer<typeof lobbyParticipantSchema>;

export const incomingClientWsMessageSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("LEAVE"), userId: userIdSchema }),
	z.object({ type: z.literal("GET_LOBBY") }),
	z.object({ type: z.literal("ERROR"), error: z.string() }),
]);

export const outgoingClientWsMessageSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("LOBBY_UPDATE"),
		lobby: z.array(lobbyParticipantSchema),
	}),
	z.object({ type: z.literal("ERROR"), error: z.string() }),
]);

type OutgoingClientWsMessage = z.infer<typeof outgoingClientWsMessageSchema>;

export function createLobbyWsService<T extends WebSocket>(ws: T) {
	const wsSend = (message: OutgoingClientWsMessage) => {
		ws.send(JSON.stringify(message));
	};

	return {
		sendLobbyUpdate: (lobby: LobbyParticipant[]) =>
			wsSend({ type: "LOBBY_UPDATE", lobby }),
		sendError: (error: string) => wsSend({ type: "ERROR", error }),
	};
}
