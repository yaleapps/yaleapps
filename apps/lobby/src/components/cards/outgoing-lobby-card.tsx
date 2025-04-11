import { Button } from "@/components/ui/button";
import type { LobbyParticipant } from "@repo/lobby-durable-object/types";
import { Clock } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function OutgoingLobbyCard({ user }: { user: LobbyParticipant }) {
	return (
		<BaseLobbyCard user={user} variant="outgoing">
			<Button
				size="lg"
				variant="outline"
				className="w-full border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/50 dark:to-orange-950/50 hover:from-amber-100/50 hover:to-orange-100/50 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 text-amber-700 dark:text-amber-300 cursor-wait group"
				disabled
			>
				<Clock className="mr-2 h-5 w-5 animate-spin [animation-duration:3s]" />
				<span className="font-medium">Awaiting Response</span>
			</Button>
		</BaseLobbyCard>
	);
}
