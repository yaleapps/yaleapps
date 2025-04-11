import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/integrations/trpc/react";
import { getCurrentMealType } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/match")({
	component: MatchQueue,
});

function MatchQueue() {
	const navigate = useNavigate();
	const trpc = useTRPC();

	const { data: matchData, isLoading } = useQuery({
		...trpc.lobby.getCurrentMatch.queryOptions(),
		refetchInterval: 2000, // Poll every 2 seconds
	});

	const { mutate: acceptMatch } = useMutation(
		trpc.lobby.acceptAndRecordMatch.mutationOptions({
			onSuccess: (data) => {
				if (data.isFullyMatched) {
					toast.success("Match accepted! You can now message each other.");
				}
			},
			onError: () => {
				toast.error("Failed to accept match");
			},
		}),
	);

	const { mutate: rejectMatch } = useMutation(
		trpc.lobby.rejectMatch.mutationOptions({
			onSuccess: () => {
				navigate({ to: "/lobby" });
				toast.info("Match declined. Looking for another match...");
			},
			onError: () => {
				toast.error("Failed to reject match");
			},
		}),
	);

	// If no match is found, redirect back to lobby
	useEffect(() => {
		if (!isLoading && !matchData) {
			navigate({ to: "/lobby" });
		}
	}, [isLoading, matchData, navigate]);

	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-gradient-to-b from-background to-background/95 p-4 md:p-6 lg:p-8">
			<div className="w-full max-w-md space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
						Do you want to match?
					</h1>
					<p className="text-sm text-muted-foreground">
						We found someone who might be a great {getCurrentMealType()} partner
					</p>
				</div>

				<Card className="overflow-hidden">
					{isLoading ? (
						<>
							<CardHeader className="space-y-3">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-3 w-1/4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-16 w-full" />
							</CardContent>
							<CardFooter className="justify-between border-t p-4">
								<Skeleton className="h-10 w-24" />
								<Skeleton className="h-10 w-24" />
							</CardFooter>
						</>
					) : matchData?.matchedUser ? (
						<>
							<CardHeader>
								<h2 className="text-xl font-semibold">
									{matchData.matchedUser.user.name}
								</h2>
								<p className="text-sm text-muted-foreground">
									{matchData.matchedUser.profile.college} • Class of{" "}
									{matchData.matchedUser.profile.year}
								</p>
							</CardHeader>
							<CardContent>
								<p className="text-sm">{matchData.matchedUser.profile.vibes}</p>
								{matchData.status === "matched" && (
									<div className="mt-4 rounded-lg bg-muted p-4">
										<p className="text-sm font-medium">Contact Info</p>
										<p className="text-sm text-muted-foreground">
											{matchData.matchedUser.profile.phoneNumber}
										</p>
									</div>
								)}
							</CardContent>
							<CardFooter className="justify-between border-t p-4">
								{!matchData.hasAcceptedMatch ? (
									<>
										<Button
											variant="outline"
											size="lg"
											className="w-[45%]"
											onClick={() => {
												rejectMatch();
											}}
										>
											<X className="mr-2 h-4 w-4" />
											Decline
										</Button>
										<Button
											size="lg"
											className="w-[45%]"
											onClick={() => {
												acceptMatch();
											}}
										>
											<Check className="mr-2 h-4 w-4" />
											Accept
										</Button>
									</>
								) : matchData.status !== "matched" ? (
									<div className="flex w-full flex-col items-center gap-2">
										<div className="flex items-center gap-2">
											<span className="text-sm">
												Waiting for {matchData.matchedUser.user.name} to
												accept...
											</span>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												rejectMatch();
											}}
										>
											Cancel
										</Button>
									</div>
								) : (
									<Button
										className="w-full"
										onClick={() => navigate({ to: "/lobby" })}
									>
										Return to Lobby
									</Button>
								)}
							</CardFooter>
						</>
					) : null}
				</Card>
			</div>
		</div>
	);
}
