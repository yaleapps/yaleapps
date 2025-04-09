import { z } from "zod";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";

const userIdSchema = z.string().brand("UserId");

export const lobbyParticipantSchema = z.object({
	userId: userIdSchema,
	profile: lobbyProfileFormSchema,
	preferences: z.record(userIdSchema, z.boolean()),
});

export type LobbyParticipant = z.infer<typeof lobbyParticipantSchema>;

export const incomingClientWsMessageSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("JOIN"), participant: lobbyParticipantSchema }),
	z.object({ type: z.literal("LEAVE"), userId: userIdSchema }),
	z.object({ type: z.literal("GET_LOBBY") }),
	z.object({ type: z.literal("ERROR"), error: z.string() }),
]);
