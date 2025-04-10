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
import { Check, Clock, Filter, Phone, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

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
						type="mutual"
					/>
					<RenderUserSection
						title="Interested in You"
						users={filteredUsers.incoming}
						type="incoming"
					/>
					<RenderUserSection
						title="Your Interests"
						users={filteredUsers.outgoing}
						type="outgoing"
					/>
					<RenderUserSection
						title="Others in Lobby"
						users={filteredUsers.neutral}
						type="neutral"
					/>
				</div>
			</div>
		</div>
	);
}

type LobbyCardType = "mutual" | "incoming" | "outgoing" | "neutral";

interface LobbyCardProps {
	user: LobbyParticipant;
	type: LobbyCardType;
}

function LobbyCard({ user, type }: LobbyCardProps) {
	const trpc = useTRPC();
	const { mutate: acceptParticipant } = useMutation(
		trpc.lobby.acceptParticipant.mutationOptions(),
	);
	const { mutate: rejectParticipant } = useMutation(
		trpc.lobby.rejectParticipant.mutationOptions(),
	);

	const cardActions = {
		mutual: (
			<Button
				size="lg"
				className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium"
				onClick={() =>
					(window.location.href = `sms:${user.profile.phoneNumber}`)
				}
			>
				<Phone className="mr-2 h-5 w-5" />
				Message {user.profile.firstName}
			</Button>
		),
		incoming: (
			<Button
				size="lg"
				className="w-full bg-primary/90 hover:bg-primary transition-all"
				onClick={() => acceptParticipant({ id: user.userId as UserId })}
			>
				<Check className="mr-2 h-5 w-5" />
				Let's Connect!
			</Button>
		),
		outgoing: (
			<Button
				size="lg"
				variant="outline"
				className="w-full opacity-70 cursor-not-allowed"
				disabled
			>
				<Clock className="mr-2 h-5 w-5 animate-spin" />
				Pending Response
			</Button>
		),
		neutral: (
			<div className="flex gap-3">
				<Button
					variant="outline"
					size="default"
					className="w-1/2 transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
					onClick={() => rejectParticipant({ id: user.userId as UserId })}
				>
					<X className="mr-2 h-4 w-4" />
					Not Today
				</Button>
				<Button
					size="default"
					className="w-1/2 bg-primary/90 transition-all hover:bg-primary"
					onClick={() => acceptParticipant({ id: user.userId as UserId })}
				>
					<Check className="mr-2 h-4 w-4" />
					Let's Connect!
				</Button>
			</div>
		),
	};

	return (
		<Card className="group relative overflow-hidden transition-all hover:shadow-md">
			<div className="p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div className="space-y-1.5">
						<h3 className="text-base font-medium leading-none">
							Class of {user.profile.year}
						</h3>
						<div className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-sm font-semibold text-secondary-foreground">
							{user.profile.diningHall}
						</div>
					</div>
				</div>
				<blockquote className="border-l-2 border-primary/20 pl-3 italic text-muted-foreground text-sm">
					"{user.profile.vibes}"
				</blockquote>
			</div>
			<div className="border-t px-4 py-3">{cardActions[type]}</div>
		</Card>
	);
}

function RenderUserSection({
	title,
	users,
	type,
}: {
	title: string;
	users: LobbyParticipant[];
	type: LobbyCardType;
}) {
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
					<LobbyCard key={user.userId} user={user} type={type} />
				))}
			</div>
		</div>
	);
}
