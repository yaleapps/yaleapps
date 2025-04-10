import { Card } from "@/components/ui/card";
import type { LobbyParticipant } from "@repo/lobby-durable-object/types";

interface BaseLobbyCardProps {
	user: LobbyParticipant;
	children?: React.ReactNode;
}

export function BaseLobbyCard({ user, children }: BaseLobbyCardProps) {
	return (
		<Card className="group relative overflow-hidden transition-all hover:shadow-md">
			<div className="p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div className="space-y-1.5">
						<h3 className="text-base font-medium leading-none">
							Class of {user.profile.year}
						</h3>
						<div className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-sm font-semibold text-secondary-foreground">
							{user.profile.diningHall}
						</div>
					</div>
				</div>
				<blockquote className="border-l-2 border-primary/20 pl-3 italic text-muted-foreground text-sm">
					"{user.profile.vibes}"
				</blockquote>
			</div>
			{children && <div className="border-t px-4 py-3">{children}</div>}
		</Card>
	);
}
