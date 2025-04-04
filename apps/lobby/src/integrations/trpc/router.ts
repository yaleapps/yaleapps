import type { TRPCRouterRecord } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "./init";

const peopleRouter = {
	list: publicProcedure.query(async ({ ctx }) => {
		return { ctx };
	}),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
	people: peopleRouter,
});
export type TRPCRouter = typeof trpcRouter;
