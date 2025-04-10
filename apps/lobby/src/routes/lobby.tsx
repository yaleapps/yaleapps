import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLobbyWebSocket } from "@/lib/useLobby";
import { authClient } from "@repo/auth/better-auth/client";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import type {
	LobbyParticipant,
	UserId,
} from "@repo/lobby-durable-object/types";
import {
	createFileRoute,
	useNavigate
} from "@tanstack/react-router";
import { Check, Filter, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CategorizedUsers = {
	mutual: LobbyParticipant[];
	incoming: LobbyParticipant[];
	outgoing: LobbyParticipant[];
	neutral: LobbyParticipant[];
};

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
	const navigate = useNavigate();
	const { lobbyParticipants: initialParticipants } = Route.useLoaderData();
	const { data: lobbyParticipants } = useLobbyWebSocket({
		initialParticipants,
	});

	const { data: session } = authClient.useSession();
	const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

	const categorizedUsers = useMemo(() => {
		const myProfile = lobbyParticipants.find(
			(user) => user.userId === session?.user.id,
		);
		const otherProfiles = lobbyParticipants.filter(
			(user) => user.userId !== session?.user.id,
		);

		const myUserId = session?.user.id as UserId;

		if (!myProfile) {
			toast.error("Something went wrong: no profile found for current user");
			throw navigate({ to: "/" });
		}

		if (!session) {
			toast.error("Something went wrong: no session found");
			throw navigate({ to: "/" });
		}

		return otherProfiles.reduce(
			(acc, user) => {
				const theyLikeMe = user.preferences[myUserId] ?? false;
				const iLikeThem = myProfile.preferences[user.userId] ?? false;

				if (iLikeThem && theyLikeMe) {
					acc.mutual.push(user);
				} else if (theyLikeMe) {
					acc.incoming.push(user);
				} else if (iLikeThem) {
					acc.outgoing.push(user);
				} else {
					acc.neutral.push(user);
				}

				return acc;
			},
			{
				mutual: [],
				incoming: [],
				outgoing: [],
				neutral: [],
			} as CategorizedUsers,
		);
	}, [lobbyParticipants, session, navigate]);

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
						actionType="accept"
					/>
					<RenderUserSection
						title="Your Interests"
						users={filteredUsers.outgoing}
					/>
					<RenderUserSection
						title="Others in Lobby"
						users={filteredUsers.neutral}
						showActions={true}
						actionType="accept"
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
	actionType = "none",
}: {
	title: string;
	users: LobbyParticipant[];
	showActions?: boolean;
	actionType?: "accept" | "reject" | "none";
}) {
	if (users.length === 0) return null;
	const handleAccept = (userId: string) => {
		// TODO: Implement accept logic
		toast.success("Interest shown!");
	};

	const handleReject = (userId: string) => {
		// TODO: Implement reject logic
		toast.info("Maybe next time!");
	};

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold tracking-tight">{title}</h2>
			<div className="space-y-4">
				{users.map((user) => (
					<Card key={user.userId} className="overflow-hidden">
						<div className="flex items-center justify-between p-4">
							<ProfileCard
								key={user.userId}
								name={""}
								image={null}
								diningHall={user.profile.diningHall}
								year={user.profile.year}
								vibes={user.profile.vibes}
								joinedAt={new Date()}
								isAnonymous={false}
								onClick={() => {}}
							/>
							{showActions && (
								<div className="flex gap-2">
									{actionType === "accept" && (
										<Button size="sm" onClick={() => handleAccept(user.userId)}>
											<Check className="mr-2 h-4 w-4" />
											Accept
										</Button>
									)}
									{actionType === "reject" && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleReject(user.userId)}
										>
											<X className="mr-2 h-4 w-4" />
											Decline
										</Button>
									)}
								</div>
							)}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
