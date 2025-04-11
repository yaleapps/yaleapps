import { Button } from "@/components/ui/button";
import { useTRPC } from "@/integrations/trpc/react";
import type { LobbyParticipant, UserId } from "@repo/lobby-server/types";
import { useMutation } from "@tanstack/react-query";
import { Clock, Sparkles } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function NeutralLobbyCard({
	me,
	them,
}: {
	me: LobbyParticipant;
	them: LobbyParticipant;
}) {
	const trpc = useTRPC();
	const { mutate: acceptParticipant, isPending: isAccepting } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);
	const { mutate: rejectParticipant, isPending: isRejecting } = useMutation(
		trpc.lobby.rejectParticipant.mutationOptions(),
	);

	return (
		<BaseLobbyCard me={me} them={them} variant="neutral">
			<Button
				variant="outline"
				size="lg"
				className="w-1/2 border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 hover:-translate-y-0.5"
				onClick={() => rejectParticipant({ id: them.userId as UserId })}
				disabled={isRejecting || isAccepting}
			>
				<Clock className="mr-2 h-4 w-4" />
				{isRejecting ? "Declining..." : "Decline"}
			</Button>
			<Button
				size="lg"
				className="w-1/2 bg-gradient-to-r from-blue-500 to-sky-500 dark:from-blue-600 dark:to-sky-600 hover:from-blue-600 hover:to-sky-600 dark:hover:from-blue-500 dark:hover:to-sky-500 text-white font-medium shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-900/40 hover:-translate-y-0.5 group"
				onClick={() => acceptParticipant({ id: them.userId as UserId })}
				disabled={isRejecting || isAccepting}
			>
				<Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
				{isAccepting ? "Accepting..." : "Accept"}
			</Button>
		</BaseLobbyCard>
	);
}
