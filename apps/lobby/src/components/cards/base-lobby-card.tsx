import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
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
		<Card className="group transition hover:shadow-md">
			<CardHeader className="flex items-center gap-1.5 text-sm text-primary">
				<MapPin className="h-4 w-4" />
				<span>{user.profile.diningHall}</span>
			</CardHeader>
			<CardContent className="space-y-8">
				<blockquote className="text-xl text-muted-foreground">
					"{user.profile.vibes}"
				</blockquote>

				<h3 className="font-medium leading-none text-muted-foreground text-right">
					— Anonymous {user.profile.year}
				</h3>
			</CardContent>

			<CardFooter className="flex justify-between border-t">
				{children}
			</CardFooter>
		</Card>
	);
}
