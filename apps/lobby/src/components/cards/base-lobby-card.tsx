import { Card } from "@/components/ui/card";
import type { LobbyParticipant } from "@repo/lobby-durable-object/types";
import { MapPin } from "lucide-react";

export function BaseLobbyCard({
	user,
	children,
}: {
	user: LobbyParticipant;
	children: React.ReactNode;
}) {
	return (
		<Card className="group relative overflow-hidden transition-all hover:shadow-md">
			<div className="p-6 space-y-4">
				<div className="flex items-center gap-1.5 text-sm text-primary">
					<MapPin className="h-4 w-4" />
					<span>{user.profile.diningHall}</span>
				</div>

				<blockquote className="text-xl text-muted-foreground">
					"{user.profile.vibes}"
				</blockquote>

				<h3 className="font-medium leading-none text-muted-foreground text-right">
					— Anonymous {user.profile.year}
				</h3>
			</div>

			<div className="border-t px-6 py-4 bg-muted/30">{children}</div>
		</Card>
	);
}
