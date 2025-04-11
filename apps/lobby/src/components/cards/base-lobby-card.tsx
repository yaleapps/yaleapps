import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
	LobbyParticipant,
	PreferenceValue,
} from "@repo/lobby-server/types";
import { PREFERENCE_EXPIRATION_SECONDS } from "@repo/lobby-server/types";
import { MapPin, User, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";

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
			bg: "bg-gradient-to-br from-purple-50/80 to-fuchsia-50/80 dark:from-purple-950/40 dark:to-fuchsia-950/40",
			border: "border-purple-200/50 dark:border-purple-800/50",
			shadow: "shadow-purple-100/50 dark:shadow-purple-900/20",
			hover: "hover:border-purple-300 dark:hover:border-purple-700",
		},
		incoming: {
			bg: "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40",
			border: "border-emerald-200/50 dark:border-emerald-800/50",
			shadow: "shadow-emerald-100/50 dark:shadow-emerald-900/20",
			hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
		},
		outgoing: {
			bg: "bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40",
			border: "border-amber-200/50 dark:border-amber-800/50",
			shadow: "shadow-amber-100/50 dark:shadow-amber-900/20",
			hover: "hover:border-amber-300 dark:hover:border-amber-700",
		},
		neutral: {
			bg: "bg-gradient-to-br from-blue-50/80 to-sky-50/80 dark:from-blue-950/40 dark:to-sky-950/40",
			border: "border-blue-200/50 dark:border-blue-800/50",
			shadow: "shadow-blue-100/50 dark:shadow-blue-900/20",
			hover: "hover:border-blue-300 dark:hover:border-blue-700",
		},
		default: {
			bg: "bg-card",
			border: "border-border",
			shadow: "shadow-black/5",
			hover: "hover:border-border/80",
		},
	};

	const styles = variantStyles[variant];
	const initials = their.profile.vibes
		.split(" ")
		.map((word) => word[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<Card
			className={cn(
				"group relative overflow-hidden backdrop-blur-[2px] transition-all duration-300",
				"hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5",
				"border shadow-md will-change-transform",
				styles.bg,
				styles.border,
				styles.shadow,
				styles.hover,
			)}
		>
			<ExpirationTimer
				preference={my.preferences[their.userId]}
				otherPreference={their.preferences[my.userId]}
				variant={variant}
			/>

			<CardContent className="space-y-6 p-6">
				<div className="flex items-start gap-4">
					<blockquote className="flex-1 text-xl text-muted-foreground italic leading-relaxed">
						"{their.profile.vibes}"
					</blockquote>
					<Avatar className="h-12 w-12 border-2 border-background shadow-md">
						<AvatarFallback className="bg-muted text-muted-foreground">
							{initials}
						</AvatarFallback>
					</Avatar>
				</div>

				<Separator className="my-4" />

				<div className="flex flex-wrap items-center gap-3">
					<Badge variant="secondary">
						<MapPin className="h-4 w-4" aria-hidden="true" />
						<span>{their.profile.diningHall}</span>
					</Badge>
					<Badge variant="secondary">
						<User className="h-4 w-4" aria-hidden="true" />
						<span>{their.profile.year}</span>
					</Badge>
					<Badge variant="outline">
						<Clock className="h-4 w-4" aria-hidden="true" />
						<span>Available Now</span>
					</Badge>
				</div>
			</CardContent>

			<CardFooter className="gap-2 pb-2">{children}</CardFooter>
		</Card>
	);
}

const variantColors = {
	mutual: "from-purple-500 to-fuchsia-500",
	incoming: "from-emerald-500 to-teal-500",
	outgoing: "from-amber-500 to-orange-500",
	neutral: "from-blue-500 to-sky-500",
	default: "from-gray-500 to-slate-500",
} as const;

export function ExpirationTimer({
	preference,
	otherPreference,
	variant = "default",
}: {
	preference: PreferenceValue | undefined;
	otherPreference: PreferenceValue | undefined;
	variant?: keyof typeof variantColors;
}) {
	const [timeLeft, setTimeLeft] = useState(() => {
		if (!preference?.expiresAt && !otherPreference?.expiresAt) return 0;

		const preferenceTime = preference?.expiresAt
			? Math.max(0, (preference.expiresAt - Date.now()) / 1000)
			: 0;

		const otherPreferenceTime = otherPreference?.expiresAt
			? Math.max(0, (otherPreference.expiresAt - Date.now()) / 1000)
			: 0;

		return Math.max(preferenceTime, otherPreferenceTime);
	});

	const progress = Math.max(
		0,
		Math.min(1, timeLeft / PREFERENCE_EXPIRATION_SECONDS),
	);
	const isExpired = timeLeft === 0;

	useEffect(() => {
		if (isExpired) return;

		const interval = setInterval(() => {
			setTimeLeft((current) => {
				const newTime = Math.max(0, current - 1);
				if (newTime === 0) clearInterval(interval);
				return newTime;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isExpired]);

	const formatTimeLeft = () => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = Math.floor(timeLeft % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	if (!preference?.expiresAt && !otherPreference?.expiresAt) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="absolute inset-x-0 top-0 h-0.5">
						<div className="absolute inset-0 bg-muted/10" />
						<div
							className={cn(
								"absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-1000",
								variantColors[variant],
								isExpired && "animate-pulse opacity-50",
							)}
							style={{ width: `${progress * 100}%` }}
						/>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p className="text-sm font-medium">
						{isExpired
							? "Connection Expired"
							: `Time remaining: ${formatTimeLeft()}`}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
