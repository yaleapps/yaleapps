import { activeLobbyUsers, lobbyProfiles, matches } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gt, ne, or, sql } from "drizzle-orm";
import { protectedProcedure } from "../init";
import { lobbyFormSchema } from "@/routes";
import { z } from "zod";

const INACTIVE_THRESHOLD = 30 * 1000;

export const lobbyRouter = {
	joinLobby: protectedProcedure
		.input(z.object({ lobbyProfile: lobbyFormSchema }))
		.mutation(async ({ ctx, input: { lobbyProfile } }) => {
			await ctx.db.transaction(async (tx) => {
				const newLobbyProfile = {
					userId: ctx.session.user.id,
					...lobbyProfile,
					updatedAt: new Date(),
				} satisfies typeof lobbyProfiles.$inferInsert;

				const newActiveUser = {
					userId: ctx.session.user.id,
					lastPingedAt: new Date(),
				} satisfies typeof activeLobbyUsers.$inferInsert;

				await tx.insert(lobbyProfiles).values(newLobbyProfile);
				await tx.insert(activeLobbyUsers).values(newActiveUser);
			});
		}),

	getPotentialMatches: protectedProcedure.query(async ({ ctx }) => {
		const potentialMatches = await ctx.db.query.activeLobbyUsers.findMany({
			where: and(
				gt(
					activeLobbyUsers.lastPingedAt,
					new Date(new Date().getTime() - INACTIVE_THRESHOLD),
				),
				ne(activeLobbyUsers.userId, ctx.session.user.id),
			),
			with: { profile: true },
		});

		return potentialMatches;
	}),

	updatePingTime: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.update(activeLobbyUsers)
			.set({ lastPingedAt: new Date() })
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	leaveLobby: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.delete(activeLobbyUsers)
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	getCurrentMatch: protectedProcedure.query(async ({ ctx }) => {
		const match = await ctx.db.query.matches.findFirst({
			where: and(
				or(
					eq(matches.user1Id, ctx.session.user.id),
					eq(matches.user2Id, ctx.session.user.id),
				),
				and(
					eq(matches.user1Status, "accepted"),
					eq(matches.user2Status, "accepted"),
				),
			),
			with: {
				user1: true,
				user2: true,
				user1Profile: true,
				user2Profile: true,
			},
		});

		if (!match) return null;

		const isUser1 = match.user1Id === ctx.session.user.id;
		return {
			matchId: match.id,
			otherUser: {
				user: isUser1 ? match.user2 : match.user1,
				profile: isUser1 ? match.user2Profile : match.user1Profile,
			},
			isFullyMatched: true,
		};
	}),

	acceptMatch: protectedProcedure
		.input(z.object({ matchedUserId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const existingMatch = await ctx.db.query.matches.findFirst({
				where: and(
					eq(matches.user1Id, input.matchedUserId),
					eq(matches.user2Id, ctx.session.user.id),
					eq(matches.user1Status, "accepted"),
					eq(matches.user2Status, "pending"),
				),
			});

			if (existingMatch) {
				// If there is, update it to fully matched
				await ctx.db
					.update(matches)
					.set({ user2Status: "accepted" })
					.where(eq(matches.id, existingMatch.id));
				return;
			}

			// Otherwise create a new match record
			await ctx.db.insert(matches).values({
				user1Id: ctx.session.user.id,
				user2Id: input.matchedUserId,
				user1Status: "accepted",
				user2Status: "pending",
				createdAt: new Date(),
			});
		}),
} satisfies TRPCRouterRecord;
