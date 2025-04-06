import { createTRPCRouter } from "./init";
import { lobbyRouter } from "./routers/lobby";

export const trpcRouter = createTRPCRouter({
	lobby: lobbyRouter,
});
export type TRPCRouter = typeof trpcRouter;
