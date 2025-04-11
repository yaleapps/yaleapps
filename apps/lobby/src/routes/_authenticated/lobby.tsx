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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLobbyWebSocket } from "@/lib/useLobby";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, LayoutGrid, ListFilter, Users } from "lucide-react";
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
	const { lobbyParticipants: initialParticipants } = Route.useLoaderData();
	const {
		data: { categorizedUsers, me },
	} = useLobbyWebSocket({
		initialParticipants,
	});

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
	].sort((a, b) => {
		// Prioritize incoming connections
		if (
			filteredUsers.incoming.includes(a) &&
			!filteredUsers.incoming.includes(b)
		)
			return -1;
		if (
			!filteredUsers.incoming.includes(a) &&
			filteredUsers.incoming.includes(b)
		)
			return 1;
		// Then prioritize outgoing connections
		if (
			filteredUsers.outgoing.includes(a) &&
			!filteredUsers.outgoing.includes(b)
		)
			return -1;
		if (
			!filteredUsers.outgoing.includes(a) &&
			filteredUsers.outgoing.includes(b)
		)
			return 1;
		return 0;
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
			<div className="mx-auto max-w-5xl space-y-8">
				<Card className="border-none bg-background/60 shadow-xl backdrop-blur-sm">
					<CardHeader className="pb-4">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1.5">
								<CardTitle className="bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-4xl font-bold text-transparent">
									Lunch Lobby
								</CardTitle>
								<CardDescription className="text-base">
									Find lunch partners in your college's dining hall
								</CardDescription>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setViewMode(viewMode === "feed" ? "tabs" : "feed")
									}
									className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50"
								>
									{viewMode === "feed" ? (
										<>
											<LayoutGrid className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
											<span>Grid View</span>
										</>
									) : (
										<>
											<ListFilter className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
											<span>Feed View</span>
										</>
									)}
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50"
										>
											<Filter className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
											{selectedCollege || "Filter by College"}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56 backdrop-blur-sm"
									>
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
							<Card className="border-none bg-muted/50 p-8 text-center shadow-none">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/50 p-3 shadow-inner">
									<Users className="h-6 w-6 text-muted-foreground" />
								</div>
								<h2 className="mb-2 text-xl font-semibold">
									The lobby is quiet right now...
								</h2>
								<p className="text-sm text-muted-foreground">
									Check back soon or invite friends to join!
								</p>
							</Card>
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
												them now to coordinate lunch.
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
												Discover Lunch Partners
											</h2>
											<p className="text-sm text-muted-foreground">
												Connect with others looking for lunch companions
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
