import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { TRPCProvider } from "@/integrations/trpc/react";

import type { AppRouter } from "@repo/lobby-durable-object/app";

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchStreamLink({
			transformer: superjson,
			url: "http://localhost:8787/trpc",
			fetch: (url, options) => {
				return fetch(url, { ...options, credentials: "include" });
			},
		}),
	],
});

const queryClient = new QueryClient({
	defaultOptions: {
		dehydrate: { serializeData: superjson.serialize },
		hydrate: { deserializeData: superjson.deserialize },
	},
});

const serverHelpers = createTRPCOptionsProxy({
	client: trpcClient,
	queryClient: queryClient,
});

export function getContext() {
	return {
		queryClient,
		trpc: serverHelpers,
	};
}

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
			{children}
		</TRPCProvider>
	);
}
