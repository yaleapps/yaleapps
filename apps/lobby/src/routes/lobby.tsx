import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/integrations/trpc/react";
import { useLobbyWebSocket } from "@/lib/useLobby";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import type {
	LobbyParticipant,
	UserId,
} from "@repo/lobby-durable-object/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Filter, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/lobby")({
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

	const filteredUsers = useMemo(() => {
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
	}, [categorizedUsers, selectedCollege]);

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
					<RenderUserSection
						title="Mutual Interest"
						users={filteredUsers.mutual}
					/>
					<RenderUserSection
						title="Interested in You"
						users={filteredUsers.incoming}
						showActions={true}
					/>
					<RenderUserSection
						title="Your Interests"
						users={filteredUsers.outgoing}
					/>
					<RenderUserSection
						title="Others in Lobby"
						users={filteredUsers.neutral}
						showActions={true}
					/>
				</div>
			</div>
		</div>
	);
}

function RenderUserSection({
	title,
	users,
	showActions = false,
}: {
	title: string;
	users: LobbyParticipant[];
	showActions?: boolean;
}) {
	const trpc = useTRPC();
	const { mutate: acceptParticipant } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);
	const { mutate: rejectParticipant } = useMutation(
		trpc.lobby.rejectParticipant.mutationOptions(),
	);

	if (users.length === 0) return null;

	return (
		<div className="space-y-4">
			<h2
				className="text-lg font-semibold tracking-tight"
				id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
			>
				{title}
			</h2>
			<div className="grid gap-4 md:grid-cols-2">
				{users.map((user) => (
					<Card
						key={user.userId}
						className="group relative overflow-hidden transition-all hover:shadow-md"
					>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<h3 className="text-base font-medium leading-none">
										Class of {user.profile.year}
									</h3>
									<div className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-semibold text-secondary-foreground">
										{user.profile.diningHall}
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3 pb-4">
							<blockquote className="border-l-2 border-primary/20 pl-3 italic text-muted-foreground">
								"{user.profile.vibes}"
							</blockquote>
							<p className="text-xs text-muted-foreground/60">
								Joined{" "}
								{new Date().toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</p>
						</CardContent>
						{showActions && (
							<CardFooter className="border-t px-4 py-3">
								<div className="flex w-full justify-between gap-3">
									<Button
										variant="outline"
										size="default"
										className="w-[45%] transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
										onClick={() =>
											rejectParticipant({ id: user.userId as UserId })
										}
									>
										<X className="mr-2 h-4 w-4" />
										Not Today
									</Button>
									<Button
										size="default"
										className="w-[45%] bg-primary/90 transition-all hover:bg-primary"
										onClick={() =>
											acceptParticipant({ id: user.userId as UserId })
										}
									>
										<Check className="mr-2 h-4 w-4" />
										Let's Connect!
									</Button>
								</div>
							</CardFooter>
						)}
					</Card>
				))}
			</div>
		</div>
	);
}
