import { createAPIFileRoute } from "@tanstack/react-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trpcRouter } from "@/integrations/trpc/router";
import { createContext } from "@/integrations/trpc/init";

function handler({ request }: { request: Request }) {
	return fetchRequestHandler({
		req: request,
		router: trpcRouter,
		createContext,
		endpoint: "/api/trpc",
	});
}

export const APIRoute = createAPIFileRoute("/api/trpc/$")({
	GET: handler,
	POST: handler,
});
