import { hc } from "hono/client";
import type { AppType } from "@repo/lobby-durable-object/app";
import type { LobbyProfileForm } from "@repo/db/validators/lobby";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const client = hc<AppType>("http://localhost:8787/", {
	fetch: ((input, init) => {
		return fetch(input, { ...init, credentials: "include" });
	}) satisfies typeof fetch,
});

export const useUpsertLobbyProfile = () =>
	useMutation({
		mutationFn: (profile: LobbyProfileForm) =>
			client.upsertLobbyProfile.$post({ form: profile }),

		onSuccess: () => {
			toast.success("Lobby profile updated");
		},
		onError: (e) => {
			toast.error(`Failed to update lobby profile: ${e.message}`);
		},
	});
