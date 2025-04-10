import { getEnv } from "@/lib/env";
import { createAuth } from "@repo/auth/better-auth/server";
import * as schema from "@repo/db/schema";
import { TRPCError, initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import superjson from "superjson";

export async function createContext({ req }: FetchCreateContextFnOptions) {
	const env = await getEnv();
	const db = drizzle(env.DB, { schema, logger: true });
	const auth = createAuth({ db, yaliesApiKey: env.YALIES_API_KEY });

	const session = await auth.api.getSession({
		headers: req.headers,
	});

	return { db, session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure that checks if the user is logged in.
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

/**
 * Protected procedure that checks if the user is logged in and in the lobby (with a temporary lobby participant id)
 */
export const protectedProcedureWithLobby = protectedProcedure.use(
	async ({ ctx, next }) => {
		const currentLobbyParticipant =
			await ctx.db.query.lobbyParticipantProfiles.findFirst({
				where: eq(schema.lobbyParticipantProfiles.userId, ctx.session.user.id),
			});

		if (!currentLobbyParticipant) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be in the lobby to view other participants",
			});
		}

		return next({
			ctx: {
				...ctx,
				currentLobbyParticipant,
			},
		});
	},
);
