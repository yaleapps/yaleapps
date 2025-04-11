import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PREFERENCE_EXPIRATION_SECONDS } from "@repo/lobby-server/types";
import type { PreferenceValue } from "@repo/lobby-server/types";
import { useEffect, useState } from "react";

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
					<div className="relative h-1 w-full overflow-hidden rounded-t-xl">
						<div className="absolute inset-0 bg-muted/20" />
						<div
							className={cn(
								"absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-1000",
								variantColors[variant],
								isExpired && "animate-pulse",
							)}
							style={{ width: `${progress * 100}%` }}
						/>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p className="text-sm">
						{isExpired
							? "Connection Expired"
							: `Time remaining: ${formatTimeLeft()}`}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
