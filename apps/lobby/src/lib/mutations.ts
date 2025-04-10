import type { LobbyProfileForm } from "@repo/db/validators/lobby";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@repo/auth/better-auth/client";
import { client } from "./client";

export const useUpsertLobbyProfile = () =>
	useMutation({
		onMutate: async () => {
			const { data: session, error } = await authClient.getSession();
			if (error) throw new Error(`${error.status} ${error.statusText}`);
			if (!session) {
				const { error } = await authClient.signIn.anonymous();
				if (error) throw new Error(`${error.status} ${error.statusText}`);
			}
		},
		mutationFn: async (profile: LobbyProfileForm) => {
			const res = await client.upsertLobbyProfile.$post({ form: profile });
			if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
			return res.json();
		},

		onSuccess: () => {
			toast.success("Lobby profile updated");
		},
		onError: (e) => {
			toast.error(`Failed to update lobby profile: ${e.message}`);
		},
	});
