import { lobbyFormSchema } from "@/routes";
import {
	lobbyParticipantPreferences,
	lobbyParticipantProfiles,
	lobbyParticipants,
	matchParticipants,
	matches,
} from "@repo/db/schema";
import { buildConflictUpdateColumns } from "@repo/db/utils";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { and, eq, ne, or } from "drizzle-orm";
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
						} satisfies typeof lobbyParticipantProfiles.$inferInsert;

						await tx
							.insert(lobbyParticipantProfiles)
							.values(newLobbyProfile)
							.onConflictDoUpdate({
								target: [lobbyParticipantProfiles.userId],
								set: buildConflictUpdateColumns(lobbyParticipantProfiles, [
									"diningHall",
									"year",
									"vibes",
									"phoneNumber",
									"updatedAt",
								]),
							});
					};

					const ensureParticipantInLobby = async () => {
						const newParticipant = {
							userId: ctx.session.user.id,
						} satisfies typeof lobbyParticipants.$inferInsert;

						await tx
							.insert(lobbyParticipants)
							.values(newParticipant)
							.onConflictDoNothing({ target: [lobbyParticipants.userId] });
					};

					await upsertLobbyProfile();
					await ensureParticipantInLobby();
				}),
		),

	leaveLobby: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.delete(lobbyParticipants)
			.where(eq(lobbyParticipants.userId, ctx.session.user.id));
	}),

	getLobby: protectedProcedure.query(async ({ ctx }) => {
		const myParticipant = await ctx.db.query.lobbyParticipants.findFirst({
			where: eq(lobbyParticipants.userId, ctx.session.user.id),
		});

		if (!myParticipant) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be in the lobby to view other participants",
			});
		}

		const otherParticipants = await ctx.db.query.lobbyParticipants.findMany({
			where: ne(lobbyParticipants.userId, ctx.session.user.id),
			with: {
				user: true,
				profile: true,
			},
		});

		const allPreferences = await ctx.db
			.select({
				fromParticipantId: lobbyParticipantPreferences.fromParticipantId,
				toParticipantId: lobbyParticipantPreferences.toParticipantId,
				preference: lobbyParticipantPreferences.preference,
			})
			.from(lobbyParticipantPreferences)
			.where(
				or(
					eq(lobbyParticipantPreferences.fromParticipantId, myParticipant.id),
					eq(lobbyParticipantPreferences.toParticipantId, myParticipant.id),
				),
			);

		// Map the preferences to each participant
		const participantsWithPreferences = otherParticipants.map((participant) => {
			const myResponse = allPreferences.find(
				(pref) =>
					pref.fromParticipantId === myParticipant.id &&
					pref.toParticipantId === participant.id,
			)?.preference;

			const theirResponse = allPreferences.find(
				(pref) =>
					pref.fromParticipantId === participant.id &&
					pref.toParticipantId === myParticipant.id,
			)?.preference;

			return {
				...participant,
				my_response: myResponse ?? null,
				their_response: theirResponse ?? null,
			};
		});

		return participantsWithPreferences;
	}),

	acceptAndRecordMatch: protectedProcedure
		.input(z.object({ matchedUserId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				// Record the interaction first
				await tx.insert(lobbyParticipantPreferences).values({
					fromParticipantId: ctx.session.user.id,
					toParticipantId: input.matchedUserId,
					preference: "interested",
				});

				// Check if there's a mutual interest
				const mutualInterest =
					await tx.query.lobbyParticipantPreferences.findFirst({
						where: and(
							eq(
								lobbyParticipantPreferences.fromParticipantId,
								input.matchedUserId,
							),
							eq(
								lobbyParticipantPreferences.toParticipantId,
								ctx.session.user.id,
							),
							eq(lobbyParticipantPreferences.preference, "interested"),
						),
					});

				// If there's mutual interest, create a match
				if (mutualInterest) {
					const [newMatch] = await tx.insert(matches).values({}).returning();

					const bothMatchParticipants = [
						{
							matchId: newMatch.id,
							userId: ctx.session.user.id,
						},
						{
							matchId: newMatch.id,
							userId: input.matchedUserId,
						},
					] satisfies (typeof matchParticipants.$inferInsert)[];

					await tx.insert(matchParticipants).values(bothMatchParticipants);

					// Remove both users from the lobby
					await tx
						.delete(lobbyParticipants)
						.where(
							or(
								eq(lobbyParticipants.userId, ctx.session.user.id),
								eq(lobbyParticipants.userId, input.matchedUserId),
							),
						);
				}
			});
		}),
} satisfies TRPCRouterRecord;
