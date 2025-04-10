import { Button } from "@/components/ui/button";
import { useTRPC } from "@/integrations/trpc/react";
import type {
	LobbyParticipant,
	UserId,
} from "@repo/lobby-durable-object/types";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function NeutralLobbyCard({ user }: { user: LobbyParticipant }) {
	const trpc = useTRPC();
	const { mutate: acceptParticipant, isLoading: isAccepting } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);
	const { mutate: rejectParticipant, isLoading: isRejecting } = useMutation(
		trpc.lobby.rejectParticipant.mutationOptions(),
	);

	return (
		<BaseLobbyCard user={user}>
			<div className="flex gap-3">
				<Button
					variant="outline"
					size="lg"
					className="w-1/2 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30
                   group relative overflow-hidden"
					onClick={() => rejectParticipant({ id: user.userId as UserId })}
					disabled={isRejecting || isAccepting}
				>
					<X className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
					<span className="relative z-10">Not Today</span>
				</Button>
				<Button
					size="lg"
					className="w-1/2 bg-primary/90 transition-all duration-300 hover:bg-primary
                   hover:shadow-lg hover:scale-[1.02] active:scale-100"
					onClick={() => acceptParticipant({ id: user.userId as UserId })}
					disabled={isRejecting || isAccepting}
				>
					<Check className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
					<span>{isAccepting ? "Connecting..." : "Let's Connect!"}</span>
				</Button>
			</div>
		</BaseLobbyCard>
	);
}
