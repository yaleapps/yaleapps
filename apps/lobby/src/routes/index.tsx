import { ProfileCard } from "@/components/profile-card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DINING_HALL_NAMES = ["Commons", ...RESIDENTIAL_COLLEGE_NAMES] as const;

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

const PLACEHOLDER_ROTATION_INTERVAL = 3500; // 3.5 seconds

export const lobbyFormSchema = z.object({
	diningHall: z.enum(DINING_HALL_NAMES, {
		required_error: "Please select a dining hall",
	}),
	year: z.string().min(1, "Please select your year"),
	vibes: z
		.string()
		.min(1, "Tell us about your lunch vibe")
		.max(200, "Keep it brief - under 200 characters"),
	phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

export type LobbyForm = z.infer<typeof lobbyFormSchema>;

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
		}, PLACEHOLDER_ROTATION_INTERVAL);

		return () => clearInterval(intervalId);
	}, []);

	return currentPlaceholder;
}

function LunchLobbyForm() {
	const navigate = useNavigate();
	const placeholder = usePlaceholderRotation();

	const form = useForm<LobbyForm>({
		resolver: zodResolver(lobbyFormSchema),
		defaultValues: {
			diningHall: "Commons",
			year: undefined,
			vibes: "",
			phoneNumber: "",
		},
		mode: "onBlur",
	});

	const formValues = form.watch();

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
											<FormDescription>
												Express yourself! Share your major, interests, or
												current mood (max 200 chars)
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
												Only shared via iMessage upon connection
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Card>

						<Separator className="my-6" />

						<div className="space-y-4">
							<div className="space-y-2">
								<h2 className="text-sm font-medium">Preview Your Profile</h2>
								<ProfileCard
									isPreview
									diningHall={formValues.diningHall}
									year={formValues.year}
									vibes={formValues.vibes}
								/>
							</div>

							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700"
								size="lg"
							>
								Join Lobby for 1 Hour
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
