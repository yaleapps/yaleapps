import { Button } from "@/components/ui/button";
import type { LobbyParticipant } from "@repo/lobby-durable-object/types";
import { Clock } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function OutgoingLobbyCard({ user }: { user: LobbyParticipant }) {
	return (
		<BaseLobbyCard user={user}>
			<Button
				size="lg"
				variant="outline"
				className="w-full opacity-70 cursor-not-allowed group"
				disabled
			>
				<Clock className="mr-2 h-5 w-5 animate-spin [animation-duration:3s]" />
				<span className="bg-gradient-to-r from-muted-foreground/70 to-muted-foreground bg-clip-text text-transparent">
					Pending Response
				</span>
			</Button>
		</BaseLobbyCard>
	);
}
