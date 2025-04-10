import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { wsMessageOutSchema } from "@repo/lobby-durable-object/types";

export function useLobbyWebSocket() {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	if (!session) return;

	useEffect(() => {
		const ws = new WebSocket(
			`ws://localhost:8787/joinAndGetLobby?userId=${session.user.id}`,
		);

		ws.onopen = () => {
			toast.success("Connected to Lobby");
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const message = wsMessageOutSchema.parse(data);
			switch (message.type) {
				case "LOBBY_UPDATE":
					queryClient.setQueryData(["lobby"], message.lobby);
					break;
				case "ERROR":
					toast.error(message.error);
					break;
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		return () => {
			ws.close();
		};
	}, [queryClient.setQueryData, session?.user.id]);
}
