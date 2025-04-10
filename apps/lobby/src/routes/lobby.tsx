import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/integrations/trpc/react";
import { useLobbyWebSocket } from "@/lib/useLobby";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/lobby")({
	component: LobbyScreen,
});

function LobbyScreen() {
	const { data: lobbyParticipants } = useLobbyWebSocket();
	const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

	const filteredUsers = selectedCollege
		? lobbyParticipants?.filter(
				(user) => user.profile.diningHall === selectedCollege,
			)
		: lobbyParticipants;

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
						{/* <Button variant="outline" size="sm" onClick={handleLeaveLobby}>
							Leave Lobby
						</Button> */}
					</div>
				</div>

				{/* Empty State */}
				{filteredUsers?.length === 0 && (
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

				{/* User Cards */}
				{filteredUsers && filteredUsers.length > 0 && (
					<div className="space-y-4">
						{filteredUsers.map((user) => (
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
						))}
					</div>
				)}

				{/* Match Confirmation Dialog */}
				{/* <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Match</DialogTitle>
							<DialogDescription>
								Are you sure you want to connect with{" "}
								{selectedUser?.isAnonymous ? "this user" : selectedUser?.name}?
								Once confirmed, you'll both be removed from the lobby and can
								start messaging.
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setShowMatchDialog(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleMatchConfirm}>Confirm Match</Button>
						</div>
					</DialogContent>
				</Dialog> */}
			</div>
		</div>
	);
}
