import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DINING_HALL_NAMES } from "@repo/constants";
import { VIBE_MAX_LENGTH, lobbyProfileFormSchema } from "@repo/db/validators/lobby";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const VIBE_PLACEHOLDERS = [
	"Econ major slithering around, looking for quick lunch chat...",
	"CS major seeking break from leetcode and internship talk...",
	"Pre-med needing study break from orgo problem sets...",
	"Philosophy major pondering: if a sandwich falls in the dining hall...",
	"History major time-traveling through meals, stories welcome...",
	"Math major calculating optimal bite-to-conversation ratio...",
	"Physics major studying food thermodynamics, seeking company...",
	"Art major sketching their sandwich, open to creative convos...",
	"Drama major rehearsing with their salad, seeking audience...",
	"Just a hungry soul seeking good company...",
] as const;

const PLACEHOLDER_ROTATION_INTERVAL_MS = 2500;

export const Route = createFileRoute("/")({
	component: LunchLobbyForm,
});

const GRADUATION_YEARS = Array.from(
	{ length: 4 },
	(_, i) => new Date().getFullYear() + i,
);

function usePlaceholderRotation() {
	const [currentPlaceholder, setCurrentPlaceholder] = useState(
		() =>
			VIBE_PLACEHOLDERS[Math.floor(Math.random() * VIBE_PLACEHOLDERS.length)],
	);

	useEffect(() => {
		// Only start rotation if the user hasn't started typing
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

	const form = useForm<LobbyProfileForm>({
		resolver: zodResolver(lobbyProfileFormSchema),
		defaultValues: {
			diningHall: "Commons",
			year: undefined,
			vibes: "",
			phoneNumber: "",
		},
		mode: "onBlur",
	});

	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-gradient-to-b from-background to-background/95 p-4 md:p-6 lg:p-8">
			<div className="w-full max-w-md space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
						Join the Lunch Lobby
					</h1>
					<p className="text-sm text-muted-foreground">
						Find lunch partners in your college's dining hall
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(async (values) => {
							try {
								console.log("Form Submitted:", values);
								navigate({ to: "/lobby" });
							} catch (error) {
								console.error("Failed to join lobby:", error);
								form.setError("root", {
									type: "submit",
									message: "Failed to join lobby. Please try again.",
								});
							}
						})}
						className="space-y-6"
					>
						<Card className="p-6">
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="diningHall"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Preferred College/Dining Hall</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
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
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select your year" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{GRADUATION_YEARS.map((year) => (
														<SelectItem key={year} value={year.toString()}>
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
												Your number remains private until both parties accept
												the match
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Card>

						<Separator className="my-6" />
						<Button type="submit" className="w-full" size="lg">
							Join Lobby
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
