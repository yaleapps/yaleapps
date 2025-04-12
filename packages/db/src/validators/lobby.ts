import { DINING_HALL_NAMES } from "@repo/constants";
import { z } from "zod";

export const VIBE_MAX_LENGTH = 100;

export const lobbyProfileFormSchema = z.object({
	diningHall: z.enum(DINING_HALL_NAMES, {
		required_error: "Please select a dining hall",
	}),
	year: z.string().min(1, "Please select your year"),
	vibes: z
		.string()
		.min(1, "Tell us about your vibe")
		.max(
			VIBE_MAX_LENGTH,
			`Keep it brief - under ${VIBE_MAX_LENGTH} characters`,
		),
	phoneNumber: z
		.string()
		.transform((val) => val.replace(/\D/g, ""))
		.pipe(z.string().min(10, "Please enter a valid phone number")),
});

export type LobbyProfileForm = z.infer<typeof lobbyProfileFormSchema>;
