import { Button } from "@/components/ui/button";
import { useTRPC } from "@/integrations/trpc/react";
import type {
	LobbyParticipant,
	UserId,
} from "@repo/lobby-durable-object/types";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function IncomingLobbyCard({ user }: { user: LobbyParticipant }) {
	const trpc = useTRPC();
	const { mutate: acceptParticipant, isPending } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);

	return (
		<BaseLobbyCard user={user}>
			<Button
				size="lg"
				onClick={() => acceptParticipant({ id: user.userId as UserId })}
				disabled={isPending}
				className="w-full"
			>
				<Check className="mr-2 h-5 w-5" />
				{isPending ? "Connecting..." : "Let's Connect!"}
			</Button>
		</BaseLobbyCard>
	);
}
