import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
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
	const [college, setCollege] = React.useState("");
	const [major, setMajor] = React.useState("");
	const [year, setYear] = React.useState(""); // Store as string, e.g., "2025"
	const [conversationTopic, setConversationTopic] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");

	// TODO: Implement actual submission logic (e.g., API call, navigation)
	const navigate = useNavigate({ from: Route.fullPath });
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log("Form Submitted:", {
			college,
			major,
			year,
			conversationTopic,
			// phone number is intentionally not logged here for privacy in this example
		});
		// Navigate to the lobby screen after submission (assuming '/lobby' route exists)
		// navigate({ to: '/lobby' });
		alert("Navigating to lobby (implement navigation)"); // Placeholder
	};

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
						college={college}
						major={major}
						year={year}
						conversationTopic={conversationTopic}
					/>
				</div>

				<Separator />

				{/* Join Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="college">Preferred College/Dining Hall</Label>
						<Input
							id="college"
							placeholder="e.g., Silliman, Commons"
							value={college}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setCollege(e.target.value)
							}
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="major">Major</Label>
						<Input
							id="major"
							placeholder="e.g., Computer Science"
							value={major}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setMajor(e.target.value)
							}
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="year">Year</Label>
						{/* Using Select for predefined years */}
						<Select onValueChange={setYear} value={year}>
							<SelectTrigger id="year">
								<SelectValue placeholder="Select year" />
							</SelectTrigger>
							<SelectContent>
								{/* Add more years as needed */}
								<SelectItem value="2028">2028</SelectItem>
								<SelectItem value="2027">2027</SelectItem>
								<SelectItem value="2026">2026</SelectItem>
								<SelectItem value="2025">2025</SelectItem>
								<SelectItem value="Grad">Graduate</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="conversation">
							Looking for conversations on...
						</Label>
						<Textarea
							id="conversation"
							placeholder="e.g., Summer internships, favorite classes, weekend plans..."
							value={conversationTopic}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								setConversationTopic(e.target.value)
							}
							rows={3}
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="(123) 456-7890"
							value={phoneNumber}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setPhoneNumber(e.target.value)
							}
							required
						/>
						<p className="text-xs text-muted-foreground">
							Only shared via iMessage upon connection.
						</p>
					</div>
					<Button type="submit" className="w-full">
						Join Lobby for 1 Hour
					</Button>
				</form>
			</div>
		</div>
	);
}
