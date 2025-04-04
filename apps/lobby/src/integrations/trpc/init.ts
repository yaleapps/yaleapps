import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "@repo/db";
import { getEvent } from "@tanstack/react-start/server";
import { initTRPC } from "@trpc/server";
import { drizzle } from "drizzle-orm/d1";
import superjson from "superjson";

type Env = { DB: D1Database };

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

// Example creating a context for a TRPC router
export async function createContext() {
	const env = await getEnv();
	const db = drizzle(env.DB, { schema, logger: true });

	return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
