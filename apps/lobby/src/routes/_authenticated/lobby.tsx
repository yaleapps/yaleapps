import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Command, CommandInput } from "@/components/ui/command";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useLobbyParticipants,
	useMeFromLobbyParticipants,
	useRegisterLobbyWebSocketAndInvalidateOnUpdate,
} from "@/lib/useLobby";
import { cn, getCurrentMealType } from "@/lib/utils";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import type { LobbyParticipant } from "@repo/lobby-server/types";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/lobby")({
	component: LobbyScreen,
	loader: async ({ context: { trpc, queryClient } }) => {
		const lobbyParticipants = await queryClient.ensureQueryData(
			trpc.lobby.getLobbyParticipants.queryOptions(),
		);
		return { lobbyParticipants };
	},
});

function LobbyScreen() {
	useRegisterLobbyWebSocketAndInvalidateOnUpdate();
	const { lobbyParticipants: initialParticipants } = Route.useLoaderData();
	const { data: participants } = useLobbyParticipants({
		initialParticipants,
	});
	const { data: me } = useMeFromLobbyParticipants({ initialParticipants });

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
		undefined,
	);

	const filteredParticipants = participants?.filter((participant) => {
		const matchesSearch =
			searchQuery === "" ||
			participant.profile.vibes
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.profile.year
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesLocation =
			!selectedLocation || participant.profile.diningHall === selectedLocation;

		return matchesSearch && matchesLocation;
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
			<div className="mx-auto max-w-5xl space-y-8">
				<Card>
					<CardHeader className="pb-4">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1.5">
								<CardTitle className="bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-4xl font-bold text-transparent">
									{getCurrentMealType()} Lobby
								</CardTitle>
								<CardDescription className="text-base">
									Find last-minute meal plans in your college's dining hall.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 px-4 pb-6 pt-2 sm:px-6">
						<div className="flex flex-col gap-4 sm:flex-row">
							<div className="relative flex-1">
								<Command className="overflow-visible border-0 p-0">
									<CommandInput
										value={searchQuery}
										onValueChange={setSearchQuery}
										placeholder="Search by vibes or year..."
										className="border-input"
									/>
								</Command>
							</div>
							<Select
								value={selectedLocation}
								onValueChange={setSelectedLocation}
							>
								<SelectTrigger className="w-full sm:w-[200px]">
									<SelectValue placeholder="Filter by location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Dining Halls</SelectItem>
									{RESIDENTIAL_COLLEGE_NAMES.map((college) => (
										<SelectItem key={college} value={college}>
											{college}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{!filteredParticipants?.length ? (
							<div className="relative">
								<Card className="p-4 grid gap-4 md:grid-cols-2 bg-background/20 shadow-none backdrop-blur-sm">
									{[1, 2].map((i) => (
										<Card key={i} className="shadow-none">
											<CardHeader className="gap-2 pb-4">
												<div className="flex items-center gap-4">
													<Skeleton className="h-12 w-12 rounded-full" />
													<div className="flex-1 space-y-2">
														<Skeleton className="h-4 w-[160px]" />
														<Skeleton className="h-3 w-[140px]" />
													</div>
												</div>
											</CardHeader>
											<CardContent className="space-y-4 pb-6">
												<div className="space-y-2">
													<Skeleton className="h-3 w-full" />
													<Skeleton className="h-3 w-[80%]" />
												</div>
												<div className="flex gap-2">
													<Skeleton className="h-8 w-24" />
													<Skeleton className="h-8 w-24" />
												</div>
											</CardContent>
										</Card>
									))}
								</Card>
								<div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
									<Card className="relative max-w-sm w-full overflow-hidden">
										<Skeleton className="bg-primary absolute bottom-0 w-full h-1 rounded-none" />
										<CardHeader>
											<CardTitle className="text-xl">
												{searchQuery || selectedLocation
													? "No matching dining companions found"
													: "Scanning for dining companions..."}
											</CardTitle>
											<CardDescription>
												{searchQuery || selectedLocation
													? "Try adjusting your filters"
													: "Stay tuned as more students join..."}
											</CardDescription>
										</CardHeader>
									</Card>
								</div>
							</div>
						) : (
							<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
								{filteredParticipants.map((participant) => (
									<LobbyCard
										key={participant.userId}
										me={me}
										them={participant}
									/>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function LobbyCard({
	me,
	them,
}: {
	me: LobbyParticipant | undefined;
	them: LobbyParticipant;
}) {
	const handleMessage = () => {
		window.location.href = `sms:${them.profile.phoneNumber}`;
	};

	const initials = them.profile.vibes
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
				"bg-gradient-to-br from-purple-50/80 to-fuchsia-50/80 dark:from-purple-950/40 dark:to-fuchsia-950/40",
				"border-purple-200/50 dark:border-purple-800/50",
				"shadow-purple-100/50 dark:shadow-purple-900/20",
				"hover:border-purple-300 dark:hover:border-purple-700",
			)}
		>
			<CardContent className="space-y-6 p-6">
				<div className="flex items-start gap-4">
					<blockquote className="flex-1 text-xl text-muted-foreground italic leading-relaxed">
						"{them.profile.vibes}"
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
						<span>{them.profile.diningHall}</span>
					</Badge>
					<Badge variant="secondary">
						<User className="h-4 w-4" aria-hidden="true" />
						<span>{them.profile.year}</span>
					</Badge>
					<Badge variant="outline">
						<Clock className="h-4 w-4" aria-hidden="true" />
						<span>Available Now</span>
					</Badge>
				</div>
			</CardContent>

			<div className="px-6 pb-6">
				<Button
					size="lg"
					onClick={handleMessage}
					className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 dark:from-purple-600 dark:to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-600 dark:hover:from-purple-500 dark:hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 dark:hover:shadow-purple-900/40 hover:-translate-y-0.5 active:translate-y-0"
				>
					<MessageCircle className="mr-2 h-5 w-5" />
					Message
				</Button>
			</div>
		</Card>
	);
}
