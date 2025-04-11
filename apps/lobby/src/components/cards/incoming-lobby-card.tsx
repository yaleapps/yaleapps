import { Button } from "@/components/ui/button";
import { useTRPC } from "@/integrations/trpc/react";
import type {
	LobbyParticipant,
	UserId,
} from "@repo/lobby-durable-object/types";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function IncomingLobbyCard({
	me,
	them,
}: {
	me: LobbyParticipant;
	them: LobbyParticipant;
}) {
	const trpc = useTRPC();
	const { mutate: acceptParticipant, isPending } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);

	return (
		<BaseLobbyCard me={me} them={them} variant="incoming">
			<Button
				size="lg"
				onClick={() => acceptParticipant({ id: them.userId as UserId })}
				disabled={isPending}
				className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/25 dark:shadow-emerald-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-900/40 hover:-translate-y-0.5 group"
			>
				<Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
				{isPending ? "Connecting..." : "Accept Invitation"}
			</Button>
		</BaseLobbyCard>
	);
}
