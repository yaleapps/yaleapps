import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { LobbyParticipant } from "@repo/lobby-durable-object/types";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export function BaseLobbyCard({
	user,
	children,
	className,
	variant = "default",
}: {
	user: LobbyParticipant;
	children: React.ReactNode;
	className?: string;
	variant?: "mutual" | "incoming" | "outgoing" | "neutral" | "default";
}) {
	const variantStyles = {
		mutual:
			"bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40",
		incoming:
			"bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
		outgoing:
			"bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
		neutral:
			"bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/40",
		default: "bg-card",
	};

	return (
		<Card
			className={cn(
				"group transition-all duration-300",
				"hover:shadow-lg hover:scale-[1.02]",
				"border-0 shadow-md",
				variantStyles[variant],
				className,
			)}
		>
			<CardContent className="space-y-8 pt-6">
				<Badge
					className="gap-1.5 text-sm font-medium"
					variant={variant === "default" ? "secondary" : "outline"}
				>
					<MapPin className="h-4 w-4" aria-hidden="true" />
					<span>{user.profile.diningHall}</span>
				</Badge>
				<blockquote className="text-xl text-card-foreground/80 italic">
					"{user.profile.vibes}"
				</blockquote>

				<h3 className="font-medium leading-none text-card-foreground/60 text-right">
					— Anonymous {user.profile.year}
				</h3>
			</CardContent>

			<CardFooter className="flex justify-between pt-6">{children}</CardFooter>
		</Card>
	);
}
