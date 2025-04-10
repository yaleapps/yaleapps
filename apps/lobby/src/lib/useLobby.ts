import { useTRPC } from "@/integrations/trpc/react";
import { authClient } from "@repo/auth/better-auth/client";
import {
	type UserId,
	type WsMessageIn,
	wsMessageOutSchema,
} from "@repo/lobby-durable-object/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useLobbyWebSocket() {
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const { data: session } = authClient.useSession();

	useEffect(() => {
		if (!session) return;
		const ws = new WebSocket("ws://localhost:8787/ws");

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "JOIN",
					userId: session.user.id as UserId,
				} satisfies WsMessageIn),
			);
			toast.success("Connected to Lobby");
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const message = wsMessageOutSchema.parse(data);
			switch (message.type) {
				case "LOBBY_UPDATE":
					queryClient.setQueryData(
						trpc.lobby.getLobbyParticipants.queryKey(),
						message.lobby,
					);
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
	}, [
		queryClient.setQueryData,
		session,
		trpc.lobby.getLobbyParticipants.queryKey,
	]);
	return useQuery(trpc.lobby.getLobbyParticipants.queryOptions());
}
