import type { LobbyParticipant } from "@repo/lobby-durable-object/types";
import { queryOptions } from "@tanstack/react-query";

export const lobbyQuery = queryOptions<LobbyParticipant[]>({
	queryKey: ["lobby"],
	queryFn: async () => {
		return [];
	},
});
