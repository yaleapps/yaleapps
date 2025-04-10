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
	const { mutate: acceptParticipant, isLoading } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);

	const handleConnect = () => {
		acceptParticipant({ id: user.userId as UserId });
	};

	return (
		<BaseLobbyCard user={user}>
			<Button
				size="lg"
				onClick={handleConnect}
				disabled={isLoading}
				className="w-full bg-primary/90 hover:bg-primary transition-all"
			>
				<Check className="mr-2 h-5 w-5" />
				{isLoading ? "Connecting..." : "Let's Connect!"}
			</Button>
		</BaseLobbyCard>
	);
}
