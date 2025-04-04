import { getEvent } from "@tanstack/react-start/server";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@repo/db";

export type Env = { DB: D1Database };

export function createContext() {
	const event = getEvent();
	const cloudflare = event.context?.cloudflare?.env as Env | undefined;
	if (!cloudflare) throw new Error("Cloudflare environment not found.");
	const db = drizzle(cloudflare.DB, { schema, logger: true });
	return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
