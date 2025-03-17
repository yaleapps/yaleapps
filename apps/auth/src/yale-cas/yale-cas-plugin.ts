import { betterFetch } from "@better-fetch/fetch";
import {
	APIError,
	createAuthEndpoint,
	createAuthMiddleware,
	getSessionFromCtx,
} from "better-auth/api";
import type {
	BetterAuthPlugin,
	InferOptionSchema,
	AuthPluginSchema,
	Session,
	User,
} from "better-auth/types";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";
import { mergeSchema } from "better-auth/db";
import { type } from "arktype";

const YALE_CAS_BASE_URL = "https://secure.its.yale.edu/cas";
const YALE_EMAIL_DOMAIN = "yale.edu";

export interface YaleUserWithCAS extends User {
	netId: string;
}

export interface YaleCASOptions {
	/**
	 * A useful hook to run after a CAS user
	 * is about to link their account.
	 */
	onLinkAccount?: (data: {
		casUser: {
			user: YaleUserWithCAS & Record<string, any>;
			session: Session & Record<string, any>;
		};
		newUser: {
			user: User & Record<string, any>;
			session: Session & Record<string, any>;
		};
	}) => Promise<void> | void;
	/**
	 * Custom schema for the CAS plugin
	 */
	schema?: InferOptionSchema<typeof schema>;
}

const schema = {
	user: {
		fields: {
			netId: {
				type: "string",
				required: false,
				unique: true,
			},
		},
	},
} satisfies AuthPluginSchema;

export const yaleCas = (options?: YaleCASOptions) => {
	const ERROR_CODES = {
		FAILED_TO_CREATE_USER: "Failed to create user",
		COULD_NOT_CREATE_SESSION: "Could not create session",
		NO_TICKET_PROVIDED: "No ticket provided",
		AUTHENTICATION_FAILED: "Authentication failed",
		AUTHENTICATION_ERROR: "Authentication error",
		UNAUTHORIZED: "Unauthorized",
	} as const;

	return {
		id: "yale-cas",
		endpoints: {
			signInYaleCAS: createAuthEndpoint(
				"/sign-in/yale-cas",
				{
					requireHeaders: true,
					method: "POST",
					query: z.object({ callbackURL: z.string().optional() }).optional(),
					metadata: {
						openapi: {
							description: "Sign in with Yale CAS",
							responses: {
								302: { description: "Redirect to Yale CAS login page" },
							},
						},
					},
				},
				async (ctx) => {
					const { query, headers, redirect } = ctx;
					const callbackURL = query?.callbackURL ?? "/";
					const service = getServiceUrl(headers, callbackURL);
					const loginUrl = `${YALE_CAS_BASE_URL}/login?service=${encodeURIComponent(service)}`;
					return redirect(loginUrl);
				},
			),

			callbackYaleCAS: createAuthEndpoint(
				"/callback/yale-cas",
				{
					requireHeaders: true,
					method: "GET",
					query: z.object({
						ticket: z.string(),
						callbackURL: z.string().optional(),
					}),
					metadata: {
						openapi: {
							description: "Yale CAS callback endpoint",
							responses: {
								302: {
									description:
										"Redirect to callback URL after successful authentication",
								},
								401: { description: "Authentication failed" },
								500: { description: "Internal server error" },
							},
						},
					},
				},
				async (ctx) => {
					const { query, headers } = ctx;
					const ticket = query.ticket;
					const callbackURL = query.callbackURL ?? "/";

					if (!ticket) {
						throw new APIError("BAD_REQUEST", {
							message: ERROR_CODES.NO_TICKET_PROVIDED,
						});
					}

					try {
						const service = getServiceUrl(headers, callbackURL);

						const response = await fetch(
							`${YALE_CAS_BASE_URL}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(service)}`,
						);

						const xml = await response.text();

						if (xml.includes("<cas:authenticationSuccess>")) {
							const netIdMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/);

							if (netIdMatch?.[1]) {
								const netId = netIdMatch[1];

								let user = await ctx.context.adapter.findOne<YaleUserWithCAS>({
									model: "user",
									where: [{ field: "netId", value: netId }],
								});

								const email = await getYaleEmailByNetId(netId);

								// If user doesn't exist, create a new one
								if (!user) {
									const id = ctx.context.generateId({ model: "user" });
									user = await ctx.context.internalAdapter.createUser(
										{
											id,
											netId,
											email,
											emailVerified: true,
											name: netId,
											createdAt: new Date(),
											updatedAt: new Date(),
										},
										ctx,
									);

									if (!user) {
										throw ctx.error("INTERNAL_SERVER_ERROR", {
											message: ERROR_CODES.FAILED_TO_CREATE_USER,
										});
									}
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
											message: ERROR_CODES.COULD_NOT_CREATE_SESSION,
										},
									});
								}

								await setSessionCookie(ctx, {
									session,
									user,
								});

								return ctx.redirect(callbackURL);
							}
						}

						throw new APIError("UNAUTHORIZED", {
							message: ERROR_CODES.AUTHENTICATION_FAILED,
						});
					} catch (error) {
						ctx.context.logger.error("CAS authentication error:", error);
						if (error instanceof APIError) {
							throw error;
						}
						throw new APIError("INTERNAL_SERVER_ERROR", {
							message: ERROR_CODES.AUTHENTICATION_ERROR,
						});
					}
				},
			),
		},
		hooks: {
			after: [
				{
					matcher(ctx) {
						return (
							ctx.path.startsWith("/sign-in") ||
							ctx.path.startsWith("/sign-up") ||
							ctx.path.startsWith("/callback") ||
							ctx.path.startsWith("/oauth2/callback") ||
							ctx.path.startsWith("/magic-link/verify") ||
							ctx.path.startsWith("/email-otp/verify-email")
						);
					},
					handler: createAuthMiddleware(async (ctx) => {
						// This hook would handle account linking if needed
						// Similar to the anonymous plugin's account linking functionality
						const session = await getSessionFromCtx<{ netId: string }>(ctx, {
							disableRefresh: true,
						});

						if (!session || !session.user.netId) {
							return;
						}

						const newSession = ctx.context.newSession;
						if (!newSession) {
							return;
						}

						if (options?.onLinkAccount) {
							await options.onLinkAccount({
								casUser: session,
								newUser: newSession,
							});
						}
					}),
				},
			],
		},
		schema: mergeSchema(schema, options?.schema),
		$ERROR_CODES: ERROR_CODES,
	} satisfies BetterAuthPlugin;
};

/**
 * Get the service URL for CAS callback
 */
function getServiceUrl(headers: Headers, callbackURL: string): string {
	// Check if we're in development mode
	const isDev = process.env.NODE_ENV !== "production";

	// For development, force localhost
	if (isDev) {
		const port = process.env.PORT ?? "3000"; // Default port
		const url = new URL(`http://localhost:${port}/api/auth/callback/cas`);
		url.searchParams.set("callbackURL", callbackURL);
		url.searchParams.delete("ticket");
		return url.toString();
	}

	// For production, use the headers
	const protocol = headers.get("x-forwarded-proto") ?? "https";
	const host = headers.get("x-forwarded-host") ?? headers.get("host") ?? "";

	// Remove ticket parameter if present
	const url = new URL(`${protocol}://${host}/api/auth/callback/cas`);
	url.searchParams.set("callbackURL", callbackURL);
	url.searchParams.delete("ticket");

	return url.toString();
}

async function getYalieByNetId(netId: string) {
	const { data, error } = await betterFetch("https://api.yalies.io/v2/people", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.YALE_API_KEY}`,
		},
		body: JSON.stringify({
			filters: {
				netid: netId,
			},
			page_size: 1,
		}),
		// Types from Yalies API: https://github.com/Yalies/Yalies/blob/main/yalies-shared/datatypes.ts
		output: type({
			// Identifiers
			netid: "string?",
			upi: "number?",
			email: "string?",
			mailbox: "string?",
			phone: "string?",
			fax: "string?",

			// Naming
			title: "string?",
			first_name: "string",
			preferred_name: "string?",
			middle_name: "string?",
			last_name: "string",
			suffix: "string?",
			pronouns: "string?",

			phonetic_name: "string?",
			name_recording: "string?",

			// Misc
			address: "string?",

			// Students
			school: "string?",
			school_code: "string?",
			year: "number?",
			curriculum: "string?",

			// Undergrads
			college: "string?",
			college_code: "string?",
			leave: "boolean?",
			visitor: "boolean?",
			image: "string?",
			birth_month: "number?",
			birth_day: "number?",
			major: "string?",
			access_code: "string?",

			// Staff
			organization: "string?",
			organization_code: "string?",
			unit_class: "string?",
			unit_code: "string?",
			unit: "string?",
			postal_address: "string?",
			office_building: "string?",
			office_room: "string?",
			cv: "string?",
			profile: "string?",
			website: "string?",
			education: "string?",
			publications: "string?",
		})
			.array()
			.atMostLength(1),
	});
	if (error) {
		throw new APIError("INTERNAL_SERVER_ERROR", {
			message: "Failed to get Yale email by netId",
		});
	}

	const yalie = data.at(0);

	if (!yalie) {
		throw new APIError("NOT_FOUND", {
			message: "Yale user not found",
		});
	}

	return yalie;
}
