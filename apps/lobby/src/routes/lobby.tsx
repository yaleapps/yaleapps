import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { RESIDENTIAL_COLLEGES } from "@repo/constants";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Types for our lobby data
interface LobbyUser {
	id: string;
	college: (typeof RESIDENTIAL_COLLEGES)[number];
	major: string;
	year: string;
	conversationTopic: string;
	joinedAt: Date;
}

export const Route = createFileRoute("/lobby")({
	component: LobbyScreen,
});

function LobbyScreen() {
	// State management
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
	const [users, setUsers] = useState<LobbyUser[]>([]);

	// Mock data fetching
	useEffect(() => {
		const fetchUsers = async () => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Mock data
			const mockUsers: LobbyUser[] = [
				{
					id: "1",
					college: "Berkeley",
					major: "Computer Science",
					year: "2025",
					conversationTopic: "Summer internships and tech industry trends",
					joinedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
				},
				{
					id: "2",
					college: "Branford",
					major: "Economics",
					year: "2024",
					conversationTopic: "Post-graduation plans and career advice",
					joinedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
				},
				// Add more mock users as needed
			];

			setUsers(mockUsers);
			setIsLoading(false);
		};

		fetchUsers();
	}, []);

	// Filter users by selected college
	const filteredUsers = selectedCollege
		? users.filter((user) => user.college === selectedCollege)
		: users;

	// Handle leaving lobby
	const handleLeaveLobby = () => {
		// TODO: Implement leave lobby logic
		console.log("Leaving lobby...");
	};

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
								{RESIDENTIAL_COLLEGES.map((college) => (
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
						<Button variant="outline" size="sm" onClick={handleLeaveLobby}>
							Leave Lobby
						</Button>
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="overflow-hidden">
								<CardHeader className="space-y-3">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-3 w-1/4" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-16 w-full" />
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Empty State */}
				{!isLoading && filteredUsers.length === 0 && (
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
				{!isLoading && filteredUsers.length > 0 && (
					<div className="space-y-4">
						{filteredUsers.map((user) => (
							<ProfileCard
								key={user.id}
								college={user.college}
								major={user.major}
								year={user.year}
								conversationTopic={user.conversationTopic}
								joinedAt={user.joinedAt}
								onClick={() => {
									// TODO: Implement connection dialog
									console.log("Connecting with user:", user.id);
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
