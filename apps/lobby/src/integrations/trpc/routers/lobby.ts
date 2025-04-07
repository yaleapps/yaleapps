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

					const ensureUserInLobby = async () => {
						const newActiveUser = {
							userId: ctx.session.user.id,
						} satisfies typeof activeLobbyUsers.$inferInsert;

						await tx
							.insert(activeLobbyUsers)
							.values(newActiveUser)
							.onConflictDoNothing({ target: activeLobbyUsers.userId });
					};

					await upsertLobbyProfile();
					await ensureUserInLobby();
				}),
		),

	leaveLobby: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.delete(activeLobbyUsers)
			.where(eq(activeLobbyUsers.userId, ctx.session.user.id));
	}),

	getNextPotentialMatch: protectedProcedure
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

	acceptAndRecordMatch: protectedProcedure
		.input(z.object({ matchedUserId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				const [newMatch] = await tx.insert(matches).values({}).returning();
				const bothMatchParticipants = [
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
				] satisfies (typeof matchParticipants.$inferInsert)[];
				await tx.insert(matchParticipants).values(bothMatchParticipants);

				// Remove both users from the active lobby
				const removeBothUsersFromLobby = async () => {
					await tx
						.delete(activeLobbyUsers)
						.where(
							or(
								eq(activeLobbyUsers.userId, ctx.session.user.id),
								eq(activeLobbyUsers.userId, input.matchedUserId),
							),
						);
				};

				await removeBothUsersFromLobby();
			});
		}),
} satisfies TRPCRouterRecord;
