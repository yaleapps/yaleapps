import { activeLobbyUsers, lobbyProfiles } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gt } from "drizzle-orm";
import { protectedProcedure } from "../init";
import { lobbyFormSchema } from "@/routes";
import { z } from "zod";

const INACTIVE_THRESHOLD = 30 * 1000;

export const lobbyRouter = {
	getActiveUsers: protectedProcedure.query(async ({ ctx }) => {
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

	join: protectedProcedure
		.input(lobbyFormSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(lobbyProfiles).values({
				userId: ctx.session.user.id,
				...input,
				updatedAt: new Date(),
			});
			await ctx.db.insert(activeLobbyUsers).values({
				userId: ctx.session.user.id,
				joinedAt: new Date(),
				lastPingedAt: new Date(),
				status: "active",
			});
		}),
	updatePingTime: protectedProcedure.mutation(async ({ ctx }) => {
		if (!ctx.session?.user) {
			throw new Error("User not found");
		}
		await ctx.db
			.update(activeLobbyUsers)
			.set({ lastPingedAt: new Date() })
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	leave: protectedProcedure.mutation(async ({ ctx }) => {
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

	// New match-related procedures
	initiateMatch: protectedProcedure
		.input(z.object({ targetUserId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (!ctx.session?.user) {
				throw new Error("User not found");
			}

			// Update both users' status to matching
			await ctx.db.transaction(async (tx) => {
				await tx
					.update(activeLobbyUsers)
					.set({
						status: "matching",
						matchedWithUserId: input.targetUserId,
					})
					.where(eq(activeLobbyUsers.userId, ctx.session.user.id));

				await tx
					.update(activeLobbyUsers)
					.set({
						status: "matching",
						matchedWithUserId: ctx.session.user.id,
					})
					.where(eq(activeLobbyUsers.userId, input.targetUserId));
			});
		}),

	acceptMatch: protectedProcedure.mutation(async ({ ctx }) => {
		if (!ctx.session?.user) {
			throw new Error("User not found");
		}

		// Mark current user as accepted
		await ctx.db
			.update(activeLobbyUsers)
			.set({ hasAcceptedMatch: true })
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));

		// Check if both users have accepted
		const [currentUser, matchedUser] = await Promise.all([
			ctx.db.query.activeLobbyUsers.findFirst({
				where: eq(activeLobbyUsers.userId, ctx.session.user.id),
			}),
			ctx.db.query.activeLobbyUsers.findFirst({
				where: eq(activeLobbyUsers.userId, ctx.session.user.id),
				with: { matchedWith: true },
			}),
		]);

		if (currentUser?.hasAcceptedMatch && matchedUser?.hasAcceptedMatch) {
			// Both users accepted, update their status to matched
			await ctx.db.transaction(async (tx) => {
				await tx
					.update(activeLobbyUsers)
					.set({ status: "matched" })
					.where(eq(activeLobbyUsers.userId, ctx.session.user.id));

				if (matchedUser.matchedWithUserId) {
					await tx
						.update(activeLobbyUsers)
						.set({ status: "matched" })
						.where(eq(activeLobbyUsers.userId, matchedUser.matchedWithUserId));
				}
			});
		}

		return {
			isFullyMatched:
				currentUser?.hasAcceptedMatch && matchedUser?.hasAcceptedMatch,
		};
	}),

	rejectMatch: protectedProcedure.mutation(async ({ ctx }) => {
		if (!ctx.session?.user) {
			throw new Error("User not found");
		}

		const currentUser = await ctx.db.query.activeLobbyUsers.findFirst({
			where: eq(activeLobbyUsers.userId, ctx.session.user.id),
		});

		if (!currentUser?.matchedWithUserId) {
			throw new Error("No active match found");
		}

		// Reset both users to active status
		await ctx.db.transaction(async (tx) => {
			await tx
				.update(activeLobbyUsers)
				.set({
					status: "active",
					matchedWithUserId: null,
					hasAcceptedMatch: false,
				})
				.where(eq(activeLobbyUsers.userId, ctx.session.user.id));

			await tx
				.update(activeLobbyUsers)
				.set({
					status: "active",
					matchedWithUserId: null,
					hasAcceptedMatch: false,
				})
				.where(eq(activeLobbyUsers.userId, currentUser.matchedWithUserId));
		});
	}),

	getCurrentMatch: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user) {
			throw new Error("User not found");
		}

		const currentUser = await ctx.db.query.activeLobbyUsers.findFirst({
			where: eq(activeLobbyUsers.userId, ctx.session.user.id),
			with: {
				matchedWith: {
					with: {
						user: true,
						profile: true,
					},
				},
			},
		});

		if (!currentUser || !currentUser.matchedWith) {
			return null;
		}

		return {
			matchedUser: currentUser.matchedWith,
			hasAcceptedMatch: currentUser.hasAcceptedMatch,
			status: currentUser.status,
		};
	}),
} satisfies TRPCRouterRecord;
