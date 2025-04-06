import { RESIDENTIAL_COLLEGE_NAMES } from "@repo/constants";
import { activeLobbyUsers } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../init";

// Form validation schema
export const DINING_HALL_NAMES = [
	"Commons",
	...RESIDENTIAL_COLLEGE_NAMES,
] as const;

export const lobbyFormSchema = z.object({
	diningHall: z.enum(DINING_HALL_NAMES, {
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

const INACTIVE_THRESHOLD = 30 * 1000;

export const lobbyRouter = {
	getActiveUsers: publicProcedure.query(async ({ ctx }) => {
		const activeUsers = await ctx.db.query.activeLobbyUsers.findMany({
			where: and(
				eq(activeLobbyUsers.status, "active"),
				// Only show users who have pinged recently
				gt(
					activeLobbyUsers.lastPingedAt,
					new Date(new Date().getTime() - INACTIVE_THRESHOLD),
				),
			),
			with: { user: true, profile: true },
		});
		return activeUsers;
	}),

	join: publicProcedure
		.input(lobbyFormSchema)
		.mutation(async ({ ctx, input }) => {
			const user = ctx.session?.user;
			if (!user) {
				throw new Error("User not found");
			}
			await ctx.db.insert(activeLobbyUsers).values({
				userId: user.id,
				joinedAt: new Date(),
				lastPingedAt: new Date(),
				status: "active",
			});

			// await ctx.db.insert(activeLobbyUsers).values({
			// 	id: createId(),
			// 	userId,
			// 	conversationTopic,
			// 	joinedAt: new Date(),
			// 	lastPingAt: new Date(),
			// 	status: "active",
			// });
		}),
	updatePingTime: publicProcedure.mutation(async ({ ctx }) => {
		if (!ctx.session?.user) {
			throw new Error("User not found");
		}
		await ctx.db
			.update(activeLobbyUsers)
			.set({ lastPingedAt: new Date() })
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	leave: publicProcedure.mutation(async ({ ctx }) => {
		if (!ctx.session?.user) {
			throw new Error("User not found");
		}
		await ctx.db
			.delete(activeLobbyUsers)
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));

		// Record in history
		// await ctx.db.insert(lobbyInteractions).values({
		// 	id: createId(),
		// 	userId: ctx.session.user.id,
		// 	joinedAt: new Date(), // This should ideally come from the activeLobbyUsers record
		// 	leftAt: new Date(),
		// 	reason,
		// });
	}),
} satisfies TRPCRouterRecord;
