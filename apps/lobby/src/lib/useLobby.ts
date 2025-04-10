import { lobbyQuery } from "@/lib/queries";
import {
	type UserId,
	type WsMessageIn,
	wsMessageOutSchema,
} from "@repo/lobby-durable-object/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "./auth-client";

export function useLobbyWebSocket() {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	if (!session) return useQuery(lobbyQuery);

	useEffect(() => {
		const ws = new WebSocket(
			`ws://localhost:8787/joinAndGetLobby?userId=${"1"}`,
		);

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "JOIN",
					userId: "1" as UserId,
				} satisfies WsMessageIn),
			);
			toast.success("Connected to Lobby");
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const message = wsMessageOutSchema.parse(data);
			console.log("🚀 ~ useEffect ~ message:", message);
			switch (message.type) {
				case "LOBBY_UPDATE":
					queryClient.setQueryData(lobbyQuery.queryKey, message.lobby);
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
	}, [queryClient.setQueryData]);
	return useQuery(lobbyQuery);
}
