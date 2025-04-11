import { IncomingLobbyCard } from "@/components/cards/incoming-lobby-card";
import { MutualLobbyCard } from "@/components/cards/mutual-lobby-card";
import { NeutralLobbyCard } from "@/components/cards/neutral-lobby-card";
import { OutgoingLobbyCard } from "@/components/cards/outgoing-lobby-card";
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
	const { data: categorizedUsers } = useLobbyWebSocket({
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
		<div className="min-h-screen bg-background p-4 md:p-6">
			<div className="mx-auto max-w-4xl space-y-6">
				<Card>
					<CardHeader>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<CardTitle className="text-3xl">Lunch Lobby</CardTitle>
								<CardDescription>
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
										<Button variant="outline" size="sm">
											<Filter className="mr-2 h-4 w-4" />
											{selectedCollege || "Filter by College"}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48">
										{RESIDENTIAL_COLLEGE_NAMES.map((college) => (
											<DropdownMenuCheckboxItem
												key={college}
												checked={selectedCollege === college}
												onCheckedChange={() =>
													setSelectedCollege(
														selectedCollege === college ? null : college,
													)
												}
											>
												{college}
											</DropdownMenuCheckboxItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{/* Empty State */}
						{!hasAnyUsers ? (
							<Card className="p-8 text-center">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted p-3">
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
							<div className="space-y-8">
								{filteredUsers.mutual.length > 0 && (
									<section className="space-y-4">
										<div className="space-y-1.5">
											<h2 className="text-xl font-semibold text-primary">
												Your Matches
											</h2>
											<p className="text-sm text-muted-foreground">
												You have {filteredUsers.mutual.length} match
												{filteredUsers.mutual.length === 1 ? "" : "es"}! Message
												them now to coordinate lunch.
											</p>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											{filteredUsers.mutual.map((user) => (
												<MutualLobbyCard key={user.userId} user={user} />
											))}
										</div>
									</section>
								)}

								{sortedNonMutualUsers.length > 0 && (
									<section className="space-y-4">
										<div className="space-y-1.5">
											<h2 className="text-xl font-semibold">
												Discover Lunch Partners
											</h2>
											<p className="text-sm text-muted-foreground">
												Connect with others looking for lunch companions
											</p>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											{sortedNonMutualUsers.map((user) => {
												if (filteredUsers.incoming.includes(user)) {
													return (
														<IncomingLobbyCard key={user.userId} user={user} />
													);
												}
												if (filteredUsers.outgoing.includes(user)) {
													return (
														<OutgoingLobbyCard key={user.userId} user={user} />
													);
												}
												return (
													<NeutralLobbyCard key={user.userId} user={user} />
												);
											})}
										</div>
									</section>
								)}
							</div>
						) : (
							<Tabs defaultValue="mutual" className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger value="mutual">
										Matches
										{filteredUsers.mutual.length > 0 && (
											<span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
												{filteredUsers.mutual.length}
											</span>
										)}
									</TabsTrigger>
									<TabsTrigger value="incoming">
										Interested
										{filteredUsers.incoming.length > 0 && (
											<span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
												{filteredUsers.incoming.length}
											</span>
										)}
									</TabsTrigger>
									<TabsTrigger value="outgoing">
										Your Picks
										{filteredUsers.outgoing.length > 0 && (
											<span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
												{filteredUsers.outgoing.length}
											</span>
										)}
									</TabsTrigger>
									<TabsTrigger value="neutral">
										Browse
										{filteredUsers.neutral.length > 0 && (
											<span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
												{filteredUsers.neutral.length}
											</span>
										)}
									</TabsTrigger>
								</TabsList>

								<TabsContent value="mutual" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.mutual.map((user) => (
											<MutualLobbyCard key={user.userId} user={user} />
										))}
									</div>
								</TabsContent>

								<TabsContent value="incoming" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.incoming.map((user) => (
											<IncomingLobbyCard key={user.userId} user={user} />
										))}
									</div>
								</TabsContent>

								<TabsContent value="outgoing" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.outgoing.map((user) => (
											<OutgoingLobbyCard key={user.userId} user={user} />
										))}
									</div>
								</TabsContent>

								<TabsContent value="neutral" className="mt-6">
									<div className="grid gap-4 md:grid-cols-2">
										{filteredUsers.neutral.map((user) => (
											<NeutralLobbyCard key={user.userId} user={user} />
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
