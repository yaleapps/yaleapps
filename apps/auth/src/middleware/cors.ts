import { DEV_DOMAINS, PROD_DOMAINS } from "@repo/constants/urls";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

type CORSOptions = Parameters<typeof cors>[0];

/**
 * All tRPC requests include this header, so we need to allow it.
 *
 * @see https://trpc.io/docs/client/links/httpBatchStreamLink#streaming-mode
 */
const TRPC_ACCEPT_HEADER = "trpc-accept";

const ALLOWED_ORIGINS = [
	...Object.values(DEV_DOMAINS),
	...Object.values(PROD_DOMAINS),
];

const DEFAULT_CONFIG = {
	origin: ALLOWED_ORIGINS,
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
