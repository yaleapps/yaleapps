import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { TRPCRouter } from "@repo/lobby-durable-object/app";

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();
