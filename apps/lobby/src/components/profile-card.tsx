import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

export function ProfileCard({
	name,
	image,
	diningHall,
	major,
	year,
	conversationTopic,
	joinedAt,
	isPreview = false,
	isAnonymous = false,
	onClick,
}: {
	name?: string;
	image?: string | null;
	diningHall: string;
	major: string;
	year: string;
	conversationTopic?: string;
	joinedAt?: Date;
	isPreview?: boolean;
	isAnonymous?: boolean;
	onClick?: () => void;
}) {
	return (
		<Card className="overflow-hidden transition-colors hover:bg-accent/5">
			<CardHeader className="space-y-2">
				<div className="flex items-center gap-3">
					{!isAnonymous ? (
						<>
							<Avatar>
								<AvatarImage src={image || undefined} alt={name || "User"} />
								<AvatarFallback>
									{name ? name.slice(0, 2).toUpperCase() : "AN"}
								</AvatarFallback>
							</Avatar>
							{name && <h3 className="font-semibold">{name}</h3>}
						</>
					) : (
						<div className="flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
								<User className="h-5 w-5 text-muted-foreground" />
							</div>
							<h3 className="font-semibold text-muted-foreground">
								Anonymous User
							</h3>
						</div>
					)}
					<div className="ml-auto text-sm text-muted-foreground">
						{diningHall} • {major} • {year}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{conversationTopic && <p className="text-sm">{conversationTopic}</p>}
				<div className="flex items-center justify-between">
					{joinedAt && (
						<p className="text-xs text-muted-foreground">
							Joined {formatDistanceToNow(joinedAt, { addSuffix: true })}
						</p>
					)}
					{!isPreview && onClick && (
						<Button onClick={onClick} size="sm">
							Connect
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
