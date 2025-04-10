import { useTRPC } from "@/integrations/trpc/react";
import { authClient } from "@repo/auth/better-auth/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpsertLobbyProfile = () => {
	const trpc = useTRPC();
	return useMutation(
		trpc.lobby.upsertLobbyProfile.mutationOptions({
			onMutate: async () => {
				const { data: session, error } = await authClient.getSession();
				if (error) throw new Error(`${error.status} ${error.statusText}`);
				if (!session) {
					const { error } = await authClient.signIn.anonymous();
					if (error) throw new Error(`${error.status} ${error.statusText}`);
				}
			},
			onSuccess: () => {
				toast.success("Lobby profile updated");
			},
			onError: (e) => {
				toast.error(`Failed to update lobby profile: ${e.message}`);
			},
		}),
	);
};
