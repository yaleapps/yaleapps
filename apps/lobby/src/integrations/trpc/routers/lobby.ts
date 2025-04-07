import {
	activeLobbyUsers,
	lobbyHistory,
	lobbyProfiles,
	matches,
} from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gt, or, sql } from "drizzle-orm";
import { protectedProcedure } from "../init";
import { lobbyFormSchema } from "@/routes";
import { z } from "zod";

const INACTIVE_THRESHOLD = 30 * 1000;
const MATCH_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const lobbyRouter = {
	join: protectedProcedure
		.input(lobbyFormSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				// Insert profile
				await tx.insert(lobbyProfiles).values({
					userId: ctx.session.user.id,
					...input,
					updatedAt: new Date(),
				});

				// Add to active users
				await tx.insert(activeLobbyUsers).values({
					userId: ctx.session.user.id,
					lastPingedAt: new Date(),
				});

				// Find a potential match
				const potentialMatch = await tx.query.activeLobbyUsers.findFirst({
					where: and(
						gt(
							activeLobbyUsers.lastPingedAt,
							new Date(new Date().getTime() - INACTIVE_THRESHOLD),
						),
						sql`NOT EXISTS (
							SELECT 1 FROM ${matches}
							WHERE (${matches.user1Id} = ${activeLobbyUsers.userId} OR ${matches.user2Id} = ${activeLobbyUsers.userId})
							AND (
								(${matches.user1Status} = 'pending' AND ${matches.user2Status} = 'pending')
								OR (${matches.user1Status} = 'accepted' AND ${matches.user2Status} = 'accepted')
							)
						)`,
					),
					with: { user: true, profile: true },
				});

				if (potentialMatch) {
					// Create a new match
					await tx.insert(matches).values({
						user1Id: ctx.session.user.id,
						user2Id: potentialMatch.userId,
						createdAt: new Date(),
						expiresAt: new Date(Date.now() + MATCH_EXPIRY),
					});
				}
			});
		}),

	updatePingTime: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.update(activeLobbyUsers)
			.set({ lastPingedAt: new Date() })
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	leave: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db.transaction(async (tx) => {
			// Get current matches
			const activeMatches = await tx.query.matches.findMany({
				where: or(
					eq(matches.user1Id, ctx.session.user.id),
					eq(matches.user2Id, ctx.session.user.id),
				),
			});

			// Record matches in history
			for (const match of activeMatches) {
				const otherUserId =
					match.user1Id === ctx.session.user.id ? match.user2Id : match.user1Id;
				await tx.insert(lobbyHistory).values({
					userId: ctx.session.user.id,
					joinedAt: match.createdAt,
					leftAt: new Date(),
					matchedWithUserId: otherUserId,
					reason: "left",
				});
			}

			// Remove from active users
			await tx
				.delete(activeLobbyUsers)
				.where(eq(activeLobbyUsers.userId, ctx.session.user.id));

			// Cancel any pending matches
			await tx
				.update(matches)
				.set({
					user1Status: sql`CASE WHEN user1_id = ${ctx.session.user.id} THEN 'rejected' ELSE user1_status END`,
					user2Status: sql`CASE WHEN user2_id = ${ctx.session.user.id} THEN 'rejected' ELSE user2_status END`,
				})
				.where(
					and(
						or(
							eq(matches.user1Id, ctx.session.user.id),
							eq(matches.user2Id, ctx.session.user.id),
						),
						or(
							eq(matches.user1Status, "pending"),
							eq(matches.user2Status, "pending"),
						),
					),
				);
		});
	}),

	getCurrentMatch: protectedProcedure.query(async ({ ctx }) => {
		const match = await ctx.db.query.matches.findFirst({
			where: and(
				or(
					eq(matches.user1Id, ctx.session.user.id),
					eq(matches.user2Id, ctx.session.user.id),
				),
				or(
					and(
						eq(matches.user1Status, "pending"),
						eq(matches.user2Status, "pending"),
					),
					and(
						eq(matches.user1Status, "accepted"),
						eq(matches.user2Status, "accepted"),
					),
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
			status: isUser1 ? match.user1Status : match.user2Status,
			otherUser: {
				user: isUser1 ? match.user2 : match.user1,
				profile: isUser1 ? match.user2Profile : match.user1Profile,
			},
			hasAcceptedMatch: isUser1
				? match.user1Status === "accepted"
				: match.user2Status === "accepted",
			isFullyMatched:
				match.user1Status === "accepted" && match.user2Status === "accepted",
		};
	}),

	acceptMatch: protectedProcedure
		.input(z.object({ matchId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const match = await ctx.db.query.matches.findFirst({
				where: eq(matches.id, input.matchId),
			});

			if (!match) throw new Error("Match not found");

			const isUser1 = match.user1Id === ctx.session.user.id;
			if (!isUser1 && match.user2Id !== ctx.session.user.id) {
				throw new Error("Not a participant in this match");
			}

			await ctx.db
				.update(matches)
				.set(
					isUser1
						? { user1Status: "accepted" as const }
						: { user2Status: "accepted" as const },
				)
				.where(eq(matches.id, input.matchId));

			const updatedMatch = await ctx.db.query.matches.findFirst({
				where: eq(matches.id, input.matchId),
			});

			return {
				isFullyMatched:
					updatedMatch?.user1Status === "accepted" &&
					updatedMatch?.user2Status === "accepted",
			};
		}),

	rejectMatch: protectedProcedure
		.input(z.object({ matchId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const match = await ctx.db.query.matches.findFirst({
				where: eq(matches.id, input.matchId),
			});

			if (!match) throw new Error("Match not found");

			const isUser1 = match.user1Id === ctx.session.user.id;
			if (!isUser1 && match.user2Id !== ctx.session.user.id) {
				throw new Error("Not a participant in this match");
			}

			await ctx.db
				.update(matches)
				.set(
					isUser1
						? { user1Status: "rejected" as const }
						: { user2Status: "rejected" as const },
				)
				.where(eq(matches.id, input.matchId));
		}),
} satisfies TRPCRouterRecord;
