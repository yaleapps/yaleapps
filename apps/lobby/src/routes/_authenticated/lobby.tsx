import { IncomingLobbyCard } from "@/components/cards/incoming-lobby-card";
import { MutualLobbyCard } from "@/components/cards/mutual-lobby-card";
import { NeutralLobbyCard } from "@/components/cards/neutral-lobby-card";
import { OutgoingLobbyCard } from "@/components/cards/outgoing-lobby-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useLobbyParticipantsCategorizedByStatus,
	useMeFromLobbyParticipants,
	useRegisterLobbyWebSocketAndInvalidateOnUpdate,
} from "@/lib/useLobby";
import { getCurrentMealType } from "@/lib/utils";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import { createFileRoute } from "@tanstack/react-router";
import { Ellipsis, Filter, LayoutGrid, ListFilter, Users } from "lucide-react";
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
	const { data: categorizedUsers } = useLobbyParticipantsCategorizedByStatus({
		initialParticipants,
	});
	const { data: me } = useMeFromLobbyParticipants({ initialParticipants });

	const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"feed" | "tabs">("feed");

	const filteredUsers = (() => {
		if (!selectedCollege) return categorizedUsers;
		return {
			mutual: categorizedUsers.mutual.filter(
				(user) => user.profile.diningHall === selectedCollege,
			),
			incoming: categorizedUsers.incoming.filter(
				(user) => user.profile.diningHall === selectedCollege,
			),
			outgoing: categorizedUsers.outgoing.filter(
				(user) => user.profile.diningHall === selectedCollege,
			),
			neutral: categorizedUsers.neutral.filter(
				(user) => user.profile.diningHall === selectedCollege,
			),
		};
	})();

	const hasAnyUsers = Object.values(filteredUsers).some(
		(users) => users.length > 0,
	);

	// Combine and sort non-mutual users for the feed view
	const sortedNonMutualUsers = [
		...filteredUsers.incoming,
		...filteredUsers.outgoing,
		...filteredUsers.neutral,
	];

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
							<div className="flex items-center gap-2">
								<Button
									variant="secondary"
									size="sm"
									onClick={() =>
										setViewMode(viewMode === "feed" ? "tabs" : "feed")
									}
								>
									{viewMode === "feed" ? (
										<>
											<LayoutGrid className="mr-2 h-4 w-4" />
											<span>Grid View</span>
										</>
									) : (
										<>
											<ListFilter className="mr-2 h-4 w-4" />
											<span>Feed View</span>
										</>
									)}
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="secondary" size="sm">
											<Filter className="mr-2 h-4 w-4" />
											{selectedCollege || "Filter by College"}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										{RESIDENTIAL_COLLEGE_NAMES.map((college) => (
											<DropdownMenuCheckboxItem
												key={college}
												checked={selectedCollege === college}
												onCheckedChange={() =>
													setSelectedCollege(
														selectedCollege === college ? null : college,
													)
												}
												className="transition-colors hover:bg-primary/10"
											>
												{college}
											</DropdownMenuCheckboxItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</CardHeader>
					<CardContent className="px-4 pb-6 pt-2 sm:px-6">
						{/* Empty State */}
						{!hasAnyUsers ? (
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
												Scanning for dining companions...
											</CardTitle>
											<CardDescription>
												Stay tuned as more students join...
											</CardDescription>
										</CardHeader>
									</Card>
								</div>
							</div>
						) : viewMode === "feed" ? (
							<div className="space-y-10">
								{filteredUsers.mutual.length > 0 && (
									<section className="space-y-6">
										<div className="space-y-1.5">
											<h2 className="text-2xl font-semibold tracking-tight text-primary">
												Your Matches
											</h2>
											<p className="text-sm text-muted-foreground">
												You have {filteredUsers.mutual.length} match
												{filteredUsers.mutual.length === 1 ? "" : "es"}! Message
												them now to coordinate your meal.
											</p>
										</div>
										<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
											{filteredUsers.mutual.map((user) => (
												<MutualLobbyCard
													key={user.userId}
													me={me}
													them={user}
												/>
											))}
										</div>
									</section>
								)}

								{sortedNonMutualUsers.length > 0 && (
									<section className="space-y-6">
										<div className="space-y-1.5">
											<h2 className="text-2xl font-semibold tracking-tight">
												Discover Dining Partners
											</h2>
											<p className="text-sm text-muted-foreground">
												Connect with others looking for dining companions
											</p>
										</div>
										<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
											{sortedNonMutualUsers.map((user) => {
												if (filteredUsers.incoming.includes(user)) {
													return (
														<IncomingLobbyCard
															key={user.userId}
															me={me}
															them={user}
														/>
													);
												}
												if (filteredUsers.outgoing.includes(user)) {
													return (
														<OutgoingLobbyCard
															key={user.userId}
															me={me}
															them={user}
														/>
													);
												}
												return (
													<NeutralLobbyCard
														key={user.userId}
														me={me}
														them={user}
													/>
												);
											})}
										</div>
									</section>
								)}
							</div>
						) : (
							<Tabs
								defaultValue={
									filteredUsers.mutual.length > 0
										? "mutual"
										: filteredUsers.incoming.length > 0
											? "incoming"
											: filteredUsers.outgoing.length > 0
												? "outgoing"
												: "neutral"
								}
								className="w-full"
							>
								<TabsList className="w-full">
									{filteredUsers.mutual.length > 0 && (
										<TabsTrigger value="mutual">
											Matches
											<Badge variant="default">
												{filteredUsers.mutual.length}
											</Badge>
										</TabsTrigger>
									)}
									{filteredUsers.incoming.length > 0 && (
										<TabsTrigger value="incoming">
											Incoming
											{filteredUsers.incoming.length > 0 && (
												<Badge variant="default">
													{filteredUsers.incoming.length}
												</Badge>
											)}
										</TabsTrigger>
									)}
									{filteredUsers.outgoing.length > 0 && (
										<TabsTrigger value="outgoing">
											Outgoing
											{filteredUsers.outgoing.length > 0 && (
												<Badge variant="default">
													{filteredUsers.outgoing.length}
												</Badge>
											)}
										</TabsTrigger>
									)}
									{filteredUsers.neutral.length > 0 && (
										<TabsTrigger value="neutral">
											Browse
											<Badge variant="default">
												{filteredUsers.neutral.length}
											</Badge>
										</TabsTrigger>
									)}
								</TabsList>

								<TabsContent value="mutual" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.mutual.map((user) => (
											<MutualLobbyCard key={user.userId} me={me} them={user} />
										))}
									</div>
								</TabsContent>

								<TabsContent value="incoming" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.incoming.map((user) => (
											<IncomingLobbyCard
												key={user.userId}
												me={me}
												them={user}
											/>
										))}
									</div>
								</TabsContent>

								<TabsContent value="outgoing" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.outgoing.map((user) => (
											<OutgoingLobbyCard
												key={user.userId}
												me={me}
												them={user}
											/>
										))}
									</div>
								</TabsContent>

								<TabsContent value="neutral" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.neutral.map((user) => (
											<NeutralLobbyCard key={user.userId} me={me} them={user} />
										))}
									</div>
								</TabsContent>
							</Tabs>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
