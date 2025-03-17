import type {
	BetterAuthPlugin,
	EndpointContext,
	AuthContext,
	MiddlewareContext,
	MiddlewareOptions,
} from "better-auth";
import {
	createAuthEndpoint,
	createAuthMiddleware,
	sessionMiddleware,
	APIError,
	getSessionFromCtx,
} from "better-auth/api";
import { nanoid } from "nanoid";
import { getCookie, setCookie } from "hono/cookie";
import { type } from "arktype";
import { setSessionCookie } from "better-auth/cookies";
import { mergeSchema } from "better-auth/db";

const CAS_BASE_URL = "https://secure.its.yale.edu/cas";
const SESSION_COOKIE_NAME = "auth_session";

export interface UserWithCAS {
	netId: string;
	[key: string]: unknown;
}

export interface CASOptions {
	/**
	 * Base URL for the CAS server
	 * @default "https://secure.its.yale.edu/cas"
	 */
	casBaseUrl?: string;
	/**
	 * Name of the session cookie
	 * @default "auth_session"
	 */
	sessionCookieName?: string;
	/**
	 * Custom schema for the CAS plugin
	 */
	schema?: Record<string, unknown>;
}

const schema = {
	user: {
		fields: {
			netId: {
				type: "string",
				unique: true,
			},
		},
	},
};

export const casPlugin = (options?: CASOptions) => {
	const casBaseUrl = options?.casBaseUrl ?? CAS_BASE_URL;
	const sessionCookieName = options?.sessionCookieName ?? SESSION_COOKIE_NAME;

	const ERROR_CODES = {
		NO_TICKET_PROVIDED: "No ticket provided",
		AUTHENTICATION_FAILED: "Authentication failed",
		AUTHENTICATION_ERROR: "Authentication error",
		UNAUTHORIZED: "Unauthorized",
	} as const;

	return {
		id: "cas",
		endpoints: {
			login: createAuthEndpoint(
				"/cas/login",
				{
					method: "GET",
					metadata: {
						openapi: {
							description: "Redirect to CAS login",
							responses: {
								302: {
									description: "Redirect to CAS login page",
								},
							},
						},
					},
				},
				async (ctx) => {
					// Ensure headers are available
					if (!ctx.headers) {
						throw new Error("Headers not available");
					}

					const service = getServiceUrl(ctx.headers);

					// Redirect to CAS login
					const loginUrl = `${casBaseUrl}/login?service=${encodeURIComponent(service)}`;
					return ctx.redirect(loginUrl);
				},
			),

			callback: createAuthEndpoint(
				"/cas/callback",
				{
					method: "GET",
					query: type({ ticket: "string", callbackURL: "string" }),
					requireHeaders: true,
					metadata: {
						openapi: {
							description: "CAS callback endpoint",
							responses: {
								302: {
									description:
										"Redirect to callback URL after successful authentication",
								},
								401: {
									description: "Authentication failed",
								},
								500: {
									description: "Internal server error",
								},
							},
						},
					},
				},
				async (ctx) => {
					const ticket = ctx.query.ticket;

					// Ensure headers are available
					if (!ctx.headers) {
						throw new Error("Headers not available");
					}

					const service = getServiceUrl(ctx.headers);

					if (!ticket) {
						throw new APIError("BAD_REQUEST", {
							message: ERROR_CODES.NO_TICKET_PROVIDED,
						});
					}

					try {
						// Validate the ticket with CAS server
						const response = await fetch(
							`${casBaseUrl}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(service)}`,
						);

						const xml = await response.text();

						if (xml.includes("<cas:authenticationSuccess>")) {
							const netIdMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/);

							if (netIdMatch?.[1]) {
								const netId = netIdMatch[1];

								// Create or find user
								const id = ctx.context.generateId({ model: "user" });
								const user = await ctx.context.internalAdapter.createUser(
									{
										id,
										netId,
										email: `${netId}@yale.edu`,
										emailVerified: true,
										name: netId,
										createdAt: new Date(),
										updatedAt: new Date(),
									},
									ctx,
								);

								if (!user) {
									throw ctx.error("INTERNAL_SERVER_ERROR", {
										message: "Failed to create user",
									});
								}

								// Create a session
								const session = await ctx.context.internalAdapter.createSession(
									user.id,
									ctx.request,
								);

								if (!session) {
									return ctx.json(null, {
										status: 400,
										body: {
											message: "Could not create session",
										},
									});
								}

								// Set session cookie
								await setSessionCookie(ctx, {
									session,
									user,
								});

								// Get the callback URL from query or use default
								const callbackURL = ctx.query.callbackURL;
								return ctx.redirect(callbackURL);
							}
						}

						// Authentication failed
						throw new APIError("UNAUTHORIZED", {
							message: ERROR_CODES.AUTHENTICATION_FAILED,
						});
					} catch (error) {
						console.error("CAS authentication error:", error);
						if (error instanceof APIError) {
							throw error;
						}
						throw new APIError("INTERNAL_SERVER_ERROR", {
							message: ERROR_CODES.AUTHENTICATION_ERROR,
						});
					}
				},
			),

			// Example of a protected endpoint that requires authentication
			getUser: createAuthEndpoint(
				"/cas/user",
				{
					method: "GET",
					use: [sessionMiddleware], // Use the session middleware to check if user is authenticated
					metadata: {
						openapi: {
							description: "Get the current user",
							responses: {
								200: {
									description: "Current user",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													user: {
														$ref: "#/components/schemas/User",
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
				async (ctx) => {
					// Session is available in ctx.context.session
					return ctx.json({
						user: ctx.context.session?.user,
					});
				},
			),
		},

		// Hooks for authentication flow
		hooks: {
			after: [
				{
					matcher(ctx) {
						return ctx.path.startsWith("/api/protected");
					},
					handler: createAuthMiddleware(async (ctx) => {
						const session = await getSessionFromCtx(ctx);

						if (!session) {
							throw new APIError("UNAUTHORIZED", {
								message: ERROR_CODES.UNAUTHORIZED,
							});
						}

						return { context: ctx };
					}),
				},
			],
		},

		// Define schema for CAS-specific data
		schema: mergeSchema(schema, options?.schema),
		$ERROR_CODES: ERROR_CODES,
	} satisfies BetterAuthPlugin;
};

/**
 * Get the service URL for CAS callback
 */
function getServiceUrl(headers: Headers): string {
	// Check if we're in development mode
	const isDev = process.env.NODE_ENV !== "production";

	// For development, force localhost
	if (isDev) {
		const port = process.env.PORT ?? "8787"; // Default Hono/Cloudflare Workers port
		const url = new URL(`http://localhost:${port}/api/auth/cas/callback`);
		url.searchParams.delete("ticket");
		return url.toString();
	}

	// For production, use the headers
	const protocol = headers.get("x-forwarded-proto") ?? "https";
	const host = headers.get("x-forwarded-host") ?? headers.get("host");
	if (!host) {
		throw new Error("No host found");
	}

	// Remove ticket parameter if present
	const url = new URL(`${protocol}://${host}/api/auth/cas/callback`);
	url.searchParams.delete("ticket");

	return url.toString();
}
