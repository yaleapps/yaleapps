import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { TRPCProvider } from "@/integrations/trpc/react";

import { DOMAINS } from "@repo/constants/urls";
import type { TRPCRouter } from "@repo/lobby-server/app";

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		httpBatchStreamLink({
			transformer: superjson,
			url: `${DOMAINS.LOBBY_SERVER}/trpc`,
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
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}
