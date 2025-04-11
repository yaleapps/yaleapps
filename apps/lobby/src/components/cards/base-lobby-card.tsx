import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LobbyParticipant } from "@repo/lobby-server/types";
import { MapPin, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ExpirationTimer } from "./expiration-timer";

export function BaseLobbyCard({
	me: my,
	them: their,
	children,
	variant,
}: {
	me: LobbyParticipant;
	them: LobbyParticipant;
	children: React.ReactNode;
	variant: "mutual" | "incoming" | "outgoing" | "neutral";
}) {
	const variantStyles = {
		mutual: {
			bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40",
			border: "border-purple-200 dark:border-purple-800",
			shadow: "shadow-purple-100/50 dark:shadow-purple-900/20",
		},
		incoming: {
			bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
			border: "border-emerald-200 dark:border-emerald-800",
			shadow: "shadow-emerald-100/50 dark:shadow-emerald-900/20",
		},
		outgoing: {
			bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
			border: "border-amber-200 dark:border-amber-800",
			shadow: "shadow-amber-100/50 dark:shadow-amber-900/20",
		},
		neutral: {
			bg: "bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/40",
			border: "border-blue-200 dark:border-blue-800",
			shadow: "shadow-blue-100/50 dark:shadow-blue-900/20",
		},
		default: {
			bg: "bg-card",
			border: "border-border",
			shadow: "shadow-black/5",
		},
	};

	const styles = variantStyles[variant];

	return (
		<Card
			className={cn(
				"group relative transition-all duration-300",
				"hover:shadow-lg hover:scale-[1.01]",
				"border shadow-md",
				styles.bg,
				styles.border,
				styles.shadow,
			)}
		>
			<ExpirationTimer
				preference={my.preferences[their.userId]}
				otherPreference={their.preferences[my.userId]}
				variant={variant}
			/>

			<CardContent className="space-y-6 pt-6">
				<blockquote className="text-xl text-card-foreground/80 italic leading-relaxed">
					"{their.profile.vibes}"
				</blockquote>

				<Separator className="my-4" />

				<div className="flex items-start justify-between">
					<Badge className="gap-1.5 text-sm font-medium" variant="secondary">
						<MapPin className="h-4 w-4" aria-hidden="true" />
						<span>{their.profile.diningHall}</span>
					</Badge>
					<Badge className="gap-1.5 text-sm font-medium">
						<User className="h-4 w-4" aria-hidden="true" />
						<span>{their.profile.year}</span>
					</Badge>
				</div>
			</CardContent>

			<CardFooter>{children}</CardFooter>
		</Card>
	);
}
