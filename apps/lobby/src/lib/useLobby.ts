import { lobbyQuery } from "@/lib/queries";
import {
	type UserId,
	type WsMessageIn,
	wsMessageOutSchema,
} from "@repo/lobby-durable-object/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "@repo/auth/better-auth/client";

export function useLobbyWebSocket() {
	useSignInAnonymousIfNotSignedIn();
	const queryClient = useQueryClient();

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
	}, [queryClient.setQueryData, session]);
	return useQuery(lobbyQuery);
}

async function useSignInAnonymousIfNotSignedIn() {
	const { data: session, refetch, isPending, error } = authClient.useSession();
	const { mutate: signInAnonymous } = useMutation({
		mutationFn: async () => {
			const { data: session, error } = await authClient.signIn.anonymous();
			if (error) throw new Error(error.statusText);
			return session;
		},
		onSuccess: () => refetch(),
		onError: (error) => {
			console.error("Error signing in anonymously:", error);
			toast.error(`Failed to sign in anonymously: ${error.message}`);
		},
	});

	useEffect(() => {
		if (isPending || error) return;
		if (!session) signInAnonymous();
	}, [session, isPending, error, signInAnonymous]);
}
