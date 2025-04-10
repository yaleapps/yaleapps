import type { D1Database } from "@cloudflare/workers-types";
import { createAuth } from "@repo/auth/better-auth/server";
import * as schema from "@repo/db/schema";
import { getEvent } from "@tanstack/react-start/server";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import superjson from "superjson";

type Env = { DB: D1Database; YALIES_API_KEY: string };

// Get the Cloudflare bindings for the current environment. Workaround provided by:
// https://github.com/cloudflare/workers-sdk/issues/5315#issuecomment-2779711600
async function getEnv(): Promise<Env> {
	if (process.env.NODE_ENV === "development") {
		const { getPlatformProxy } = await import("wrangler");
		const { env } = await getPlatformProxy<Env>();
		return env;
	}
	const env = getEvent().context?.cloudflare?.env as Env | undefined;
	if (!env) {
		throw new Error("Cloudflare environment is not attached to the event.");
	}
	return env;
}

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
