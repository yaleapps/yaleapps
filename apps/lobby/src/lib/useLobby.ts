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
			console.log("🚀 ~ useEffect ~ data:", data);
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
	return useQuery(
		trpc.lobby.getLobbyParticipants.queryOptions(undefined, {
			initialData: initialParticipants,
			staleTime: Number.POSITIVE_INFINITY,
			select: (data) => {
				if (!session) {
					return {
						me: undefined,
						categorizedUsers: {
							mutual: [],
							incoming: [],
							outgoing: [],
							neutral: [],
						} satisfies CategorizedUsers,
					};
				}

				const myUserId = session?.user.id as UserId;
				const me = data.find((user) => user.userId === myUserId);
				if (!me) {
					return {
						me: undefined,
						categorizedUsers: {
							mutual: [],
							incoming: [],
							outgoing: [],
							neutral: [],
						} satisfies CategorizedUsers,
					};
				}
				const otherProfiles = data.filter((user) => user.userId !== myUserId);
				return otherProfiles.reduce(
					(acc, currUser) => {
						const theirPreference = currUser.preferences[myUserId];
						const myPreference = me?.preferences[currUser.userId];

						const doTheyLikeMe =
							theirPreference &&
							theirPreference.expiresAt > new Date().getTime()
								? theirPreference.value
								: "neutral";
						const doILikeThem =
							myPreference && myPreference.expiresAt > new Date().getTime()
								? myPreference.value
								: "neutral";

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
						if (doTheyLikeMe === "reject" || doILikeThem === "reject") {
							return acc;
						}

						if (doILikeThem === "accept" && doTheyLikeMe === "accept") {
							acc.mutual.push(currUser);
						} else if (doILikeThem === "accept" && doTheyLikeMe === "neutral") {
							acc.outgoing.push(currUser);
						} else if (doILikeThem === "neutral" && doTheyLikeMe === "accept") {
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
						me: me,
						categorizedUsers: {
							mutual: [],
							incoming: [],
							outgoing: [],
							neutral: [],
						} satisfies CategorizedUsers,
					},
				);
			},
		}),
	);
}
