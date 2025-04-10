import { Button } from "@/components/ui/button";
import type { LobbyParticipant } from "@repo/lobby-durable-object/types";
import { Phone } from "lucide-react";
import { BaseLobbyCard } from "./base-lobby-card";

export function MutualLobbyCard({ user }: { user: LobbyParticipant }) {
	const handleMessage = () => {
		window.location.href = `sms:${user.profile.phoneNumber}`;
	};

	return (
		<BaseLobbyCard user={user}>
			<Button
				size="lg"
				onClick={handleMessage}
				className="w-full bg-gradient-to-r from-[#FF1CF7] via-[#7F27FF] to-[#00c6ff] hover:opacity-90 text-white font-medium
                 shadow-[0_0_20px_rgba(255,28,247,0.3)] transition-all duration-300
                 hover:shadow-[0_0_25px_rgba(255,28,247,0.5)]"
			>
				<Phone className="mr-2 h-5 w-5" />
				Message Now
			</Button>
		</BaseLobbyCard>
	);
}
