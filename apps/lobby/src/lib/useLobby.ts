import { useTRPC } from "@/integrations/trpc/react";
import { authClient } from "@repo/auth/better-auth/client";
import {
	type LobbyParticipant,
	type UserId,
	type WsMessageIn,
	wsMessageOutSchema,
} from "@repo/lobby-durable-object/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

type PreferenceValue = "like" | "dislike" | "neutral";

type CategorizedUsers = {
	mutual: LobbyParticipant[];
	incoming: LobbyParticipant[];
	outgoing: LobbyParticipant[];
	neutral: LobbyParticipant[];
};

export function useLobbyWebSocket({
	initialParticipants,
}: {
	initialParticipants: LobbyParticipant[];
}) {
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
	return useQuery(
		trpc.lobby.getLobbyParticipants.queryOptions(undefined, {
			initialData: initialParticipants,
			select: (data) => {
				if (!session) {
					return {
						mutual: [],
						incoming: [],
						outgoing: [],
						neutral: [],
					} as CategorizedUsers;
				}

				const myUserId = session?.user.id as UserId;
				const myProfile = data.find((user) => user.userId === myUserId);
				if (!myProfile) {
					return {
						mutual: [],
						incoming: [],
						outgoing: [],
						neutral: [],
					} as CategorizedUsers;
				}
				const otherProfiles = data.filter((user) => user.userId !== myUserId);
				return otherProfiles.reduce(
					(acc, currUser) => {
						const doTheyLikeMe = (currUser.preferences[myUserId] ??
							"neutral") as PreferenceValue;
						const doILikeThem = (myProfile?.preferences[currUser.userId] ??
							"neutral") as PreferenceValue;

						// Matrix of all possible combinations:
						// Me | Them | Result
						// like | like | mutual
						// like | neutral | outgoing
						// like | dislike | filtered
						// neutral | like | incoming
						// neutral | neutral | neutral
						// neutral | dislike | filtered
						// dislike | any | filtered

						// Filter out any case where either party has explicitly disliked
						if (doTheyLikeMe === "dislike" || doILikeThem === "dislike") {
							return acc;
						}

						if (doILikeThem === "like" && doTheyLikeMe === "like") {
							acc.mutual.push(currUser);
						} else if (doILikeThem === "like" && doTheyLikeMe === "neutral") {
							acc.outgoing.push(currUser);
						} else if (doILikeThem === "neutral" && doTheyLikeMe === "like") {
							acc.incoming.push(currUser);
						} else if (
							doILikeThem === "neutral" &&
							doTheyLikeMe === "neutral"
						) {
							acc.neutral.push(currUser);
						}

						return acc;
					},
					{
						mutual: [],
						incoming: [],
						outgoing: [],
						neutral: [],
					} as CategorizedUsers,
				);
			},
		}),
	);
}
