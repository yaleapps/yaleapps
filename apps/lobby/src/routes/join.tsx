import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/integrations/trpc/react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/better-auth/client";
import { DINING_HALL_NAMES } from "@repo/constants";
import {
	type LobbyProfileForm,
	VIBE_MAX_LENGTH,
	lobbyProfileFormSchema,
} from "@repo/db/validators/lobby";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const VIBE_PLACEHOLDERS = [
	"Econ major slithering around, looking for quick lunch chat...",
	"CS major seeking break from leetcode and internship talk...",
	"Pre-med needing study break from orgo problem sets...",
	"Philosophy major pondering: if a sandwich falls in the dining hall...",
	"Looking to play ping pong (intermediate ability)...",
	"Math major calculating optimal bite-to-conversation ratio...",
	"Art major sketching their sandwich, open to creative convos...",
	"Drama major rehearsing with their salad, seeking audience...",
	"Just a hungry soul seeking good company...",
] as const;

const PLACEHOLDER_ROTATION_INTERVAL_MS = 2500;

export const Route = createFileRoute("/join")({
	component: LunchLobbyForm,
	loader: async ({ context: { trpc, queryClient } }) => {
		const data = await queryClient.ensureQueryData(
			trpc.lobby.getLobbyProfileById.queryOptions(),
		);
		return data;
	},
});

const GRADUATION_YEARS = Array.from({ length: 4 }, (_, i) =>
	(new Date().getFullYear() + i).toString(),
);

function usePlaceholderRotation() {
	const [currentPlaceholder, setCurrentPlaceholder] = useState(
		() =>
			VIBE_PLACEHOLDERS[Math.floor(Math.random() * VIBE_PLACEHOLDERS.length)],
	);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentPlaceholder((prev) => {
				const currentIndex = VIBE_PLACEHOLDERS.indexOf(prev);
				const nextIndex = (currentIndex + 1) % VIBE_PLACEHOLDERS.length;
				return VIBE_PLACEHOLDERS[nextIndex];
			});
		}, PLACEHOLDER_ROTATION_INTERVAL_MS);

		return () => clearInterval(intervalId);
	}, []);

	return currentPlaceholder;
}

function LunchLobbyForm() {
	const navigate = useNavigate();
	const placeholder = usePlaceholderRotation();
	const lobbyProfile = Route.useLoaderData();

	const form = useForm<LobbyProfileForm>({
		resolver: zodResolver(lobbyProfileFormSchema),
		defaultValues: lobbyProfile ?? {
			diningHall: "Commons",
			year: undefined,
			vibes: "",
			phoneNumber: "",
		},
		mode: "onBlur",
	});

	const trpc = useTRPC();
	const { mutate: joinLobby, isPending } = useMutation(
		trpc.lobby.joinLobby.mutationOptions({
			onMutate: async () => {
				const { data: session, error } = await authClient.getSession();
				if (error) throw new Error(`${error.status} ${error.statusText}`);
				if (!session) {
					const { error } = await authClient.signIn.anonymous();
					if (error) throw new Error(`${error.status} ${error.statusText}`);
				}
			},
			onSuccess: () => {
				toast.success("Lobby profile updated");
			},
			onError: (e) => {
				toast.error(`Failed to update lobby profile: ${e.message}`);
			},
		}),
	);

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
			<Card className="w-full max-w-md px-1 z-10">
				<CardHeader className="w-full">
					<CardTitle className="text-3xl">Join the Lobby</CardTitle>
					<CardDescription>
						Find last-minute meal plans in your college's dining hall
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(async (lobbyProfile) => {
							joinLobby(
								{ profile: lobbyProfile },
								{
									onSuccess: () => {
										navigate({ to: "/lobby" });
									},
									onError: () => {
										form.setError("root", {
											type: "submit",
											message: "Failed to join lobby. Please try again.",
										});
									},
								},
							);
						})}
						className="space-y-6"
					>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="diningHall"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Preferred College/Dining Hall</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? ""}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a dining hall" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{DINING_HALL_NAMES.map((diningHall) => (
													<SelectItem key={diningHall} value={diningHall}>
														{diningHall}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Year</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? ""}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select your year" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{GRADUATION_YEARS.map((year) => (
													<SelectItem key={year} value={year}>
														{year}
													</SelectItem>
												))}
												<SelectItem value="Graduate">Graduate</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="vibes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>What's your lunch vibe?</FormLabel>
										<FormControl>
											<Textarea
												placeholder={placeholder}
												className="resize-none h-20"
												{...field}
											/>
										</FormControl>
										<FormDescription className="text-xs flex justify-between items-center">
											<span>
												Express yourself! Share your major, interests, or
												mood...
											</span>
											<span
												className={cn(
													"transition-colors text-muted-foreground",
													field.value.length > VIBE_MAX_LENGTH / 5
														? "text-yellow-500"
														: "",
													field.value.length > VIBE_MAX_LENGTH / 2
														? "text-orange-500"
														: "",
													field.value.length > VIBE_MAX_LENGTH
														? "text-destructive"
														: "",
												)}
											>
												{field.value.length}/{VIBE_MAX_LENGTH}
											</span>
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<PhoneInput {...field} />
										</FormControl>
										<FormDescription className="text-xs">
											Your number remains private until both parties accept the
											match
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={isPending}
							>
								{isPending ? (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								) : null}
								Join Lobby
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
			<ShootingStars />
		</div>
	);
}
