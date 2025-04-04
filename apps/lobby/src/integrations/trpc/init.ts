import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "@repo/db";
import { initTRPC } from "@trpc/server";
import { drizzle } from "drizzle-orm/d1";
import superjson from "superjson";
import { getPlatformProxy } from "wrangler";

type Env = { DB: D1Database };

export async function createContext() {
	const { env } = await getPlatformProxy<Env>();
	const db = drizzle(env.DB, { schema, logger: true });
	return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
