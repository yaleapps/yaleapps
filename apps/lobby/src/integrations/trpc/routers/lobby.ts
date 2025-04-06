import { activeLobbyUsers } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gt } from "drizzle-orm";
import { publicProcedure } from "../init";
import { lobbyFormSchema } from "@/routes";

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
