import { IncomingLobbyCard } from "@/components/cards/incoming-lobby-card";
import { MutualLobbyCard } from "@/components/cards/mutual-lobby-card";
import { NeutralLobbyCard } from "@/components/cards/neutral-lobby-card";
import { OutgoingLobbyCard } from "@/components/cards/outgoing-lobby-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLobbyWebSocket } from "@/lib/useLobby";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Users } from "lucide-react";
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

	return (
		<div className="min-h-screen bg-background p-4 md:p-6">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Header Section */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-2xl font-semibold tracking-tight">Lunch Lobby</h1>
					<div className="flex items-center gap-2">
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

				{/* Empty State */}
				{Object.values(filteredUsers).every((users) => users.length === 0) && (
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
				)}

				{/* User Sections */}
				<div className="space-y-8">
					{filteredUsers.mutual.length > 0 && (
						<section className="space-y-4">
							<h2 className="text-lg font-semibold tracking-tight">
								Mutual Interest
							</h2>
							<div className="grid gap-4 md:grid-cols-2">
								{filteredUsers.mutual.map((user) => (
									<MutualLobbyCard key={user.userId} user={user} />
								))}
							</div>
						</section>
					)}

					{filteredUsers.incoming.length > 0 && (
						<section className="space-y-4">
							<h2 className="text-lg font-semibold tracking-tight">
								Interested in You
							</h2>
							<div className="grid gap-4 md:grid-cols-2">
								{filteredUsers.incoming.map((user) => (
									<IncomingLobbyCard key={user.userId} user={user} />
								))}
							</div>
						</section>
					)}

					{filteredUsers.outgoing.length > 0 && (
						<section className="space-y-4">
							<h2 className="text-lg font-semibold tracking-tight">
								Your Interests
							</h2>
							<div className="grid gap-4 md:grid-cols-2">
								{filteredUsers.outgoing.map((user) => (
									<OutgoingLobbyCard key={user.userId} user={user} />
								))}
							</div>
						</section>
					)}

					{filteredUsers.neutral.length > 0 && (
						<section className="space-y-4">
							<h2 className="text-lg font-semibold tracking-tight">
								Others in Lobby
							</h2>
							<div className="grid gap-4 md:grid-cols-2">
								{filteredUsers.neutral.map((user) => (
									<NeutralLobbyCard key={user.userId} user={user} />
								))}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
