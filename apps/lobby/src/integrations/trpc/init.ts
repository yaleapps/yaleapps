import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export function createContext() {
	const user = { name: "anonymous" };

	return { user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
