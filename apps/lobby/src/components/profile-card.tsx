import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Clock, School } from "lucide-react";

export function ProfileCard({
	college,
	major,
	year,
	conversationTopic,
	joinedAt,
	isPreview = false,
	onClick,
}: {
	college: string;
	major: string;
	year: string;
	conversationTopic?: string;
	joinedAt?: Date;
	isPreview?: boolean;
	onClick?: () => void;
}) {
	const yearSuffix = year ? `'${year.toString().slice(-2)}` : "'YY";
	const timeSinceJoined = joinedAt
		? `${Math.floor((Date.now() - joinedAt.getTime()) / (1000 * 60))}m ago`
		: null;

	return (
		<Card
			className={
				onClick
					? "group cursor-pointer transition-colors hover:bg-muted/50"
					: ""
			}
			onClick={onClick}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2">
							<School className="h-4 w-4" />
							{college ?? "Preferred College"}
						</CardTitle>
						<CardDescription>
							{major ?? "Major"} {yearSuffix}
						</CardDescription>
					</div>
					{!isPreview && timeSinceJoined && (
						<Badge variant="secondary" className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{timeSinceJoined}
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<p
					className="text-sm text-muted-foreground"
					aria-live={isPreview ? "polite" : "off"}
				>
					{isPreview ? (
						<>
							Chatting about:{" "}
							{conversationTopic ?? (
								<span className="italic">What's on your mind?</span>
							)}
						</>
					) : (
						<>Looking for conversations on: {conversationTopic}</>
					)}
				</p>
			</CardContent>
		</Card>
	);
}
