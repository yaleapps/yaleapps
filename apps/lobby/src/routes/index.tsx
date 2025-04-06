import { RESIDENTIAL_COLLEGES } from "@repo/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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
import { Input } from "@/components/ui/input";
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
import { ProfileCard } from "@/components/profile-card";

export const Route = createFileRoute("/")({
	component: LunchLobbyForm,
});

const GRADUATION_YEARS = Array.from(
	{ length: 4 },
	(_, i) => new Date().getFullYear() + i,
);

const DINING_HALLS = ["Commons", ...RESIDENTIAL_COLLEGES] as const;

// Form validation schema
const formSchema = z.object({
	college: z.enum(DINING_HALLS, {
		required_error: "Please select a dining hall",
	}),
	major: z.string().min(1, "Please enter your major"),
	year: z.string().min(1, "Please select your year"),
	conversationTopic: z
		.string()
		.min(1, "Please enter a conversation topic")
		.max(200, "Topic must be less than 200 characters"),
	phoneNumber: z
		.string()
		.min(10, "Please enter a valid phone number")
		.regex(/^\d{10}$/, "Please enter a 10-digit phone number"),
});

type FormValues = z.infer<typeof formSchema>;

function LunchLobbyForm() {
	const navigate = useNavigate();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			college: undefined,
			major: "",
			year: undefined,
			conversationTopic: "",
			phoneNumber: "",
		},
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
									name="college"
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
													{DINING_HALLS.map((college) => (
														<SelectItem key={college} value={college}>
															{college}
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
									name="major"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Major</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Computer Science"
													{...field}
													className="w-full"
												/>
											</FormControl>
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
									name="conversationTopic"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Looking for conversations on...</FormLabel>
											<FormControl>
												<Textarea
													placeholder="e.g., Summer internships, favorite classes, weekend plans..."
													className="resize-none"
													{...field}
												/>
											</FormControl>
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
									college={formValues.college ?? ""}
									major={formValues.major}
									year={formValues.year ?? ""}
									conversationTopic={formValues.conversationTopic}
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
