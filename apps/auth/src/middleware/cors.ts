import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

type CORSOptions = Parameters<typeof cors>[0];

/**
 * All tRPC requests include this header, so we need to allow it.
 *
 * @see https://trpc.io/docs/client/links/httpBatchStreamLink#streaming-mode
 */
const TRPC_ACCEPT_HEADER = "trpc-accept";

const DEFAULT_CONFIG = {
	origin: ["http://localhost:3000"],
	allowHeaders: ["Content-Type", "Authorization", TRPC_ACCEPT_HEADER],
	allowMethods: ["POST", "GET", "OPTIONS"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
} satisfies CORSOptions;

export function createCorsMiddleware(
	config: Partial<CORSOptions> = {},
): MiddlewareHandler {
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	} satisfies CORSOptions;

	return cors(finalConfig);
}
