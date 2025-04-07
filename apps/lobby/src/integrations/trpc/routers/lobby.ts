import { lobbyFormSchema } from "@/routes";
import {
	activeLobbyUsers,
	lobbyProfiles,
	matchParticipants,
	matches,
} from "@repo/db/schema";
import { buildConflictUpdateColumns } from "@repo/db/utils";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, ne, notInArray, or } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../init";

export const lobbyRouter = {
	joinLobby: protectedProcedure
		.input(z.object({ lobbyProfile: lobbyFormSchema }))
		.mutation(
			async ({ ctx, input: { lobbyProfile } }) =>
				await ctx.db.transaction(async (tx) => {
					const upsertLobbyProfile = async () => {
						const newLobbyProfile = {
							userId: ctx.session.user.id,
							...lobbyProfile,
							updatedAt: new Date(),
						} satisfies typeof lobbyProfiles.$inferInsert;

						await tx
							.insert(lobbyProfiles)
							.values(newLobbyProfile)
							.onConflictDoUpdate({
								target: [lobbyProfiles.userId],
								set: buildConflictUpdateColumns(lobbyProfiles, [
									"diningHall",
									"year",
									"vibes",
									"phoneNumber",
									"updatedAt",
								]),
							});
					};

					const insertUserToLobby = async () => {
						const newActiveUser = {
							userId: ctx.session.user.id,
						} satisfies typeof activeLobbyUsers.$inferInsert;

						await tx
							.insert(activeLobbyUsers)
							.values(newActiveUser)
							.onConflictDoNothing({ target: activeLobbyUsers.userId });
					};

					await upsertLobbyProfile();
					await insertUserToLobby();
				}),
		),

	getPotentialMatch: protectedProcedure
		.input(z.object({ rejectedUserIds: z.array(z.string()) }))
		.query(async ({ ctx, input: { rejectedUserIds } }) => {
			const potentialMatches = await ctx.db.query.activeLobbyUsers.findMany({
				where: and(
					ne(activeLobbyUsers.userId, ctx.session.user.id),
					notInArray(activeLobbyUsers.userId, rejectedUserIds),
				),
				with: { profile: true },
			});

			return potentialMatches;
		}),

	leaveLobby: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.delete(activeLobbyUsers)
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	getCurrentMatch: protectedProcedure.query(async ({ ctx }) => {
		// Find the most recent match where the current user is a participant
		const matchParticipant = await ctx.db.query.matchParticipants.findFirst({
			where: eq(matchParticipants.userId, ctx.session.user.id),
			with: {
				match: true,
				profile: true,
			},
			orderBy: [desc(matchParticipants.joinedAt)],
		});

		if (!matchParticipant) return null;

		// Find the other participant(s) in this match
		const otherParticipants = await ctx.db.query.matchParticipants.findMany({
			where: and(
				eq(matchParticipants.matchId, matchParticipant.matchId),
				ne(matchParticipants.userId, ctx.session.user.id),
			),
			with: {
				user: true,
				profile: true,
			},
		});

		if (otherParticipants.length === 0) return null;

		// For now, we'll just return the first other participant
		// In the future, this could be expanded to handle multiple participants
		const otherParticipant = otherParticipants[0];

		return {
			matchId: matchParticipant.matchId,
			otherUser: {
				user: otherParticipant.user,
				profile: otherParticipant.profile,
			},
			isFullyMatched: true,
		};
	}),

	acceptMatch: protectedProcedure
		.input(z.object({ matchedUserId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				// Create a new match
				const [newMatch] = await tx
					.insert(matches)
					.values({
						createdAt: new Date(),
					})
					.returning();

				// Add both participants
				await tx.insert(matchParticipants).values([
					{
						matchId: newMatch.id,
						userId: ctx.session.user.id,
						joinedAt: new Date(),
					},
					{
						matchId: newMatch.id,
						userId: input.matchedUserId,
						joinedAt: new Date(),
					},
				]);

				// Remove both users from the active lobby
				await tx
					.delete(activeLobbyUsers)
					.where(
						or(
							eq(activeLobbyUsers.userId, ctx.session.user.id),
							eq(activeLobbyUsers.userId, input.matchedUserId),
						),
					);
			});
		}),
} satisfies TRPCRouterRecord;
