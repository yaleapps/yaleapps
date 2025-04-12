import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { TRPCRouter } from "@repo/lobby-server/app";

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();
