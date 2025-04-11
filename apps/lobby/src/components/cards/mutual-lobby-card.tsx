import { Button } from "@/components/ui/button";
import type { LobbyParticipant } from "@repo/lobby-server/types";
import { MessageCircle } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function MutualLobbyCard({
	me,
	them,
}: {
	me: LobbyParticipant;
	them: LobbyParticipant;
}) {
	const handleMessage = () => {
		window.location.href = `sms:${them.profile.phoneNumber}`;
	};

	return (
		<BaseLobbyCard me={me} them={them} variant="mutual">
			<Button
				size="lg"
				onClick={handleMessage}
				className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 dark:from-purple-600 dark:to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-600 dark:hover:from-purple-500 dark:hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-900/40 hover:-translate-y-0.5"
			>
				<MessageCircle className="mr-2 h-5 w-5" />
				Start Chatting
			</Button>
		</BaseLobbyCard>
	);
}
