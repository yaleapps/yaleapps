import { lobbyParticipantProfiles } from "@repo/db/schema";
import { buildConflictUpdateColumns } from "@repo/db/utils";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";
import { userIdSchema } from "@repo/lobby-durable-object/types";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../init";

export const lobbyRouter = {
	getLobbyProfileById: protectedProcedure
		.input(z.object({ userId: userIdSchema }))
		.query(async ({ ctx, input: { userId } }) => {
			const lobbyProfile =
				await ctx.db.query.lobbyParticipantProfiles.findFirst({
					where: eq(lobbyParticipantProfiles.userId, userId),
				});
			return lobbyProfile;
		}),
	upsertLobbyProfile: protectedProcedure
		.input(z.object({ lobbyProfile: lobbyProfileFormSchema }))
		.mutation(
			async ({ ctx, input: { lobbyProfile } }) =>
				await ctx.db.transaction(async (tx) => {
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
				}),
		),
} satisfies TRPCRouterRecord;
