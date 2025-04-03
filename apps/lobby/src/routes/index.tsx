import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";

export const Route = createFileRoute("/")({
	component: App,
});

// Form validation schema
const formSchema = z.object({
	college: z.string().min(1, "Please select a dining hall"),
	major: z.string().min(1, "Please enter your major"),
	year: z.string().min(1, "Please select your year"),
	conversationTopic: z.string().min(1, "Please enter a conversation topic"),
	phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

// Simple card component for the Live Preview
function LivePreviewCard({
	college,
	major,
	year,
	conversationTopic,
}: {
	college: string;
	major: string;
	year: string;
	conversationTopic: string;
}) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{college || "Preferred College"}</CardTitle>
				<CardDescription>
					{major || "Major"} {year ? `'${year.slice(-2)}` : "'YY"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{conversationTopic ? (
					<p className="text-sm text-muted-foreground">
						Chatting about: {conversationTopic}
					</p>
				) : (
					<p className="text-sm text-muted-foreground">
						Chatting about: [Your topic...]
					</p>
				)}
				{/* Phone number is NOT displayed here */}
			</CardContent>
		</Card>
	);
}

function App() {
	const navigate = useNavigate({ from: Route.fullPath });
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 4 }, (_, i) => currentYear + i);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			college: "",
			major: "",
			year: "",
			conversationTopic: "",
			phoneNumber: "",
		},
	});

	const formValues = form.watch();

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("Form Submitted:", values);
		// Navigate to the lobby screen after submission (assuming '/lobby' route exists)
		// navigate({ to: '/lobby' });
		alert("Navigating to lobby (implement navigation)"); // Placeholder
	}

	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-background p-4 md:p-6 lg:p-8">
			<div className="w-full max-w-md space-y-6">
				<h1 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
					Join the Lunch Lobby
				</h1>

				{/* Live Preview */}
				<div className="space-y-2">
					<Label className="text-sm font-medium">Live Preview</Label>
					<LivePreviewCard
						college={formValues.college}
						major={formValues.major}
						year={formValues.year}
						conversationTopic={formValues.conversationTopic}
					/>
				</div>

				<Separator />

				{/* Join Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="college"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Preferred College/Dining Hall</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Silliman, Commons" {...field} />
									</FormControl>
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
										<Input placeholder="e.g., Computer Science" {...field} />
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
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select year" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{years.map((y) => (
												<SelectItem key={y} value={String(y)}>
													{y}
												</SelectItem>
											))}
											<SelectItem value="Grad">Graduate</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
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
										<Input type="tel" placeholder="(123) 456-7890" {...field} />
									</FormControl>
									<FormDescription>
										Only shared via iMessage upon connection.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Join Lobby for 1 Hour
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
