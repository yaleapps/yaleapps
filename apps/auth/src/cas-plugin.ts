import type { BetterAuthPlugin, EndpointContext } from "better-auth";
import {
	createAuthEndpoint,
	createAuthMiddleware,
	sessionMiddleware,
} from "better-auth/api";
import { nanoid } from "nanoid";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { type } from "arktype";

const CAS_BASE_URL = "https://secure.its.yale.edu/cas";
const SESSION_COOKIE_NAME = "auth_session";

type User = { netId: string };

export const casPlugin = (options?: {
	casBaseUrl?: string;
	sessionCookieName?: string;
}) => {
	const casBaseUrl = options?.casBaseUrl ?? CAS_BASE_URL;
	const sessionCookieName = options?.sessionCookieName ?? SESSION_COOKIE_NAME;

	return {
		id: "cas",

		// Define endpoints for CAS authentication
		endpoints: {
			login: createAuthEndpoint(
				"/cas/login",
				{ method: "GET" },
				async (ctx) => {
					const service = getServiceUrl(ctx);

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
				},
				async (ctx) => {
					const ticket = ctx.query.ticket;
					const service = getServiceUrl(ctx.headers);

					if (!ticket) {
						return ctx.json(
							{
								status: 400,
								error: "No ticket provided",
							},
							{
								status: 400,
								statusText: "Bad Request",
							},
						);
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
								const user = { netId } satisfies User;

								// Create a session
								const sessionId = nanoid();

								// In a real implementation, you would store this session in your database
								// await ctx.context.internalAdapter.createSession(user.netId);

								// Set session cookie
								ctx.setCookie(sessionCookieName, sessionId, {
									httpOnly: true,
									secure: process.env.NODE_ENV === "production",
									sameSite: "Lax",
									path: "/",
									maxAge: 60 * 60 * 24 * 7, // 1 week
								});

								// Get the callback URL from query or use default
								const callbackURL = ctx.query.callbackURL;
								return ctx.redirect(callbackURL);
							}
						}

						// Authentication failed
						return ctx.json(
							{ error: "Authentication failed" },
							{ status: 401, statusText: "Unauthorized" },
						);
					} catch (error) {
						console.error("CAS authentication error:", error);
						return ctx.json(
							{
								status: 500,
								error: "Authentication error",
							},
							{
								status: 500,
								statusText: "Internal Server Error",
							},
						);
					}
				},
			),

			// Example of a protected endpoint that requires authentication
			getUser: createAuthEndpoint(
				"/cas/user",
				{
					method: "GET",
					use: [sessionMiddleware], // Use the session middleware to check if user is authenticated
				},
				async (ctx) => {
					// Session is available in ctx.context.session
					return ctx.json({
						user: ctx.context.session?.user,
					});
				},
			),
		},

		// Middleware to check if user is authenticated
		middleware: [
			{
				matcher: (context) => context.path.startsWith("/api/protected"),
				handler: createAuthMiddleware(async (ctx) => {
					const sessionId = getCookie(ctx.c, sessionCookieName);

					if (!sessionId) {
						return {
							status: 401,
							json: { success: false, error: "Unauthorized" },
						};
					}

					// In a real implementation, you would fetch the session from your database
					// const session = await ctx.context.adapter.session.findFirst({
					//   where: { id: sessionId }
					// });
					//
					// if (!session) {
					//   return { status: 401, json: { success: false, error: "Invalid session" } };
					// }
					//
					// const user = await ctx.context.adapter.user.findFirst({
					//   where: { id: session.userId }
					// });
					//
					// ctx.set("user", user);

					return { context: ctx };
				}),
			},
		],

		// Optional: Define schema for CAS-specific data
		schema: {
			user: {
				fields: {
					netId: {
						type: "string",
						unique: true,
					},
				},
			},
		},
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
