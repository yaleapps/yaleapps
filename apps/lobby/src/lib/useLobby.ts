import { useTRPC } from "@/integrations/trpc/react";
import { authClient } from "@repo/auth/better-auth/client";
import {
	type LobbyParticipant,
	type UserId,
	type WsMessageIn,
	wsMessageOutSchema,
} from "@repo/lobby-server/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useRegisterLobbyWebSocketAndInvalidateOnUpdate() {
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const { data: session } = authClient.useSession();

	useEffect(() => {
		if (!session) return;
		const ws = new WebSocket("ws://localhost:8787/ws");

		ws.onopen = () => {
			ws.send(JSON.stringify({ type: "GET_LOBBY" } satisfies WsMessageIn));
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const message = wsMessageOutSchema.parse(data);
			switch (message.type) {
				case "LOBBY_UPDATE":
					queryClient.invalidateQueries({
						queryKey: trpc.lobby.getLobbyParticipants.queryKey(),
					});
					break;
				case "ERROR":
					toast.error(message.error);
					break;
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			toast.error("Failed to connect to Lobby");
		};

		return () => {
			ws.close();
		};
	}, [queryClient, session, trpc]);
}

export function useMeFromLobbyParticipants({
	initialParticipants,
}: {
	initialParticipants: LobbyParticipant[];
}) {
	const trpc = useTRPC();
	const { data: session } = authClient.useSession();

	return useQuery(
		trpc.lobby.getLobbyParticipants.queryOptions(undefined, {
			initialData: initialParticipants,
			staleTime: Number.POSITIVE_INFINITY,
			select: (data) => {
				const myUserId = session?.user.id as UserId;
				return data.find((user) => user.userId === myUserId);
			},
		}),
	);
}

export function useLobbyParticipants({
	initialParticipants,
}: {
	initialParticipants: LobbyParticipant[];
}) {
	const trpc = useTRPC();
	const { data: session } = authClient.useSession();

	return useQuery(
		trpc.lobby.getLobbyParticipants.queryOptions(undefined, {
			initialData: initialParticipants,
			staleTime: Number.POSITIVE_INFINITY,
			select: (data) => {
				if (!session) return [];
				const myUserId = session.user.id as UserId;
				return data.filter((user) => user.userId !== myUserId);
			},
		}),
	);
}
