import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

type CORSOptions = Parameters<typeof cors>[0];

const DEFAULT_CONFIG = {
	origin: ["http://localhost:3000"],
	allowHeaders: ["Content-Type", "Authorization"],
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
