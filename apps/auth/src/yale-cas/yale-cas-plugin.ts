import { betterFetch } from "@better-fetch/fetch";
import { type } from "arktype";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { mergeSchema } from "better-auth/db";
import type {
	AuthPluginSchema,
	BetterAuthPlugin,
	InferOptionSchema,
	User,
} from "better-auth/types";
import { z } from "zod";

const YALE_CAS_BASE_URL = "https://secure.its.yale.edu/cas";

export interface YaleUserWithCAS extends User {
	netId: string;
}

export interface YaleCASOptions {
	/**
	 * The API key for the Yalies API.
	 */
	yaliesApiKey: string;
	/**
	 * The base URL for the auth server.
	 */
	authServerBaseUrl: string;
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

export const yaleCas = (options: YaleCASOptions) => {
	const ERROR_CODES = {
		FAILED_TO_CREATE_USER: "Failed to create user",
		COULD_NOT_CREATE_SESSION: "Could not create session",
		NO_TICKET_PROVIDED: "No ticket provided",
		AUTHENTICATION_FAILED: "Authentication failed",
		AUTHENTICATION_ERROR: "Authentication error",
		UNAUTHORIZED: "Unauthorized",
	} as const;

	const callbackUrlsSchema = {
		callbackURL: z.string({
			description: "The URL to redirect to after sign in",
		}),
		errorCallbackURL: z.string({
			description: "The URL to redirect to if an error occurs",
		}),
		newUserCallbackURL: z.string({
			description: "The URL to redirect to after login if the user is new",
		}),
	};

	/**
	 * Create a consistent service URL for CAS callback
	 * This URL must be identical in both the initial login request and validation request
	 */
	const createServiceUrl = (params: {
		callbackURL: string;
		errorCallbackURL: string;
		newUserCallbackURL: string;
	}): string => {
		const baseCallbackUrl = `${options.authServerBaseUrl}/api/auth/callback/yale-cas`;
		const url = new URL(baseCallbackUrl);

		url.searchParams.set("callbackURL", params.callbackURL);
		url.searchParams.set("errorCallbackURL", params.errorCallbackURL);
		url.searchParams.set("newUserCallbackURL", params.newUserCallbackURL);

		return url.toString();
	};

	return {
		id: "yale-cas",
		endpoints: {
			signInWithYaleCas: createAuthEndpoint(
				"/sign-in/yale-cas",
				{
					method: "POST",
					body: z.object({ ...callbackUrlsSchema }),
					metadata: {
						openapi: {
							description: "Sign in with Yale CAS",
							responses: {
								200: {
									description: "Sign in with OAuth2",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													url: { type: "string" },
													redirect: { type: "boolean" },
												},
											},
										},
									},
								},
							},
						},
					},
					requireRequest: true,
				},
				async (ctx) => {
					const {
						body: { callbackURL, errorCallbackURL, newUserCallbackURL },
					} = ctx;

					const serviceCallbackUrl = createServiceUrl({
						callbackURL,
						errorCallbackURL,
						newUserCallbackURL,
					});

					const url = `${YALE_CAS_BASE_URL}/login?service=${encodeURIComponent(serviceCallbackUrl)}`;
					ctx.context.logger.info(url);
					return ctx.json({ url });
				},
			),

			yaleCasCallback: createAuthEndpoint(
				"/callback/yale-cas",
				{
					method: "GET",
					query: z
						.object({
							...callbackUrlsSchema,
							ticket: z
								.string({ description: "The ticket from Yale CAS" })
								.optional(),
						})
						.strip(),
					metadata: {
						openapi: {
							description: "Yale CAS callback endpoint",
							responses: {
								200: {
									description: "Yale CAS callback",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: { url: { type: "string" } },
											},
										},
									},
								},
							},
						},
					},
					requireRequest: true,
				},
				async (ctx) => {
					const { ticket, callbackURL, errorCallbackURL, newUserCallbackURL } =
						ctx.query;

					if (!ticket) {
						throw new APIError("BAD_REQUEST", {
							message: ERROR_CODES.NO_TICKET_PROVIDED,
						});
					}

					ctx.context.logger.info(ticket);

					const serviceCallbackUrl = createServiceUrl({
						callbackURL,
						errorCallbackURL,
						newUserCallbackURL,
					});

					try {
						const validateTicket = async () => {
							const { data: xml, error } = await betterFetch(
								`${YALE_CAS_BASE_URL}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(serviceCallbackUrl)}`,
								{ method: "GET", output: z.string() },
							);

							if (error) {
								throw new APIError("INTERNAL_SERVER_ERROR", {
									message: ERROR_CODES.AUTHENTICATION_ERROR,
								});
							}

							ctx.context.logger.info(xml);

							if (!xml.includes("<cas:authenticationSuccess>")) {
								throw new APIError("UNAUTHORIZED", {
									message: ERROR_CODES.AUTHENTICATION_FAILED,
								});
							}
							const netIdMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/);
							const netId = netIdMatch?.[1];
							if (!netId) {
								throw new APIError("UNAUTHORIZED", {
									message: ERROR_CODES.AUTHENTICATION_FAILED,
								});
							}
							return netId;
						};

						const netId = await validateTicket();

						ctx.context.logger.info(netId);

						const user = await ctx.context.adapter.findOne<YaleUserWithCAS>({
							model: "user",
							where: [{ field: "netId", value: netId }],
						});

						if (!user) {
							ctx.context.logger.info("User not found, creating user");
							const yalie = await getYalieByNetId({
								netId,
								apiKey: options.yaliesApiKey,
							});
							if (!yalie.email) {
								throw new APIError("INTERNAL_SERVER_ERROR", {
									message: ERROR_CODES.FAILED_TO_CREATE_USER,
								});
							}
							const newUser =
								await ctx.context.internalAdapter.createUser<YaleUserWithCAS>(
									{
										id: ctx.context.generateId({ model: "user" }),
										netId: yalie.netid,
										email: yalie.email,
										emailVerified: false,
										name: `${yalie.first_name} ${yalie.last_name}`,
										image: yalie.image,
										createdAt: new Date(),
										updatedAt: new Date(),
									},
									ctx,
								);

							if (!newUser) {
								throw ctx.error("INTERNAL_SERVER_ERROR", {
									message: ERROR_CODES.FAILED_TO_CREATE_USER,
								});
							}

							const session = await ctx.context.internalAdapter.createSession(
								newUser.id,
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
								user: newUser,
							});

							throw ctx.redirect(newUserCallbackURL);
						}

						ctx.context.logger.info("User found, creating session");

						const session = await ctx.context.internalAdapter.createSession(
							user.id,
							ctx.request,
						);

						if (!session) {
							ctx.context.logger.error("Could not create session");
							return ctx.json(null, {
								status: 400,
								body: {
									message: ERROR_CODES.COULD_NOT_CREATE_SESSION,
								},
							});
						}

						ctx.context.logger.info("Setting session cookie");

						await setSessionCookie(ctx, { session, user });

						ctx.context.logger.info(`Redirecting to URL: ${callbackURL}`);

						throw ctx.redirect(callbackURL);
					} catch (error) {
						ctx.context.logger.error("CAS authentication error:", error);
						throw ctx.redirect(errorCallbackURL);
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
		schema: mergeSchema(schema, options?.schema),
		$ERROR_CODES: ERROR_CODES,
	} satisfies BetterAuthPlugin;
};

/**
 * Get the service URL for CAS callback
 */
function getServiceUrl({
	headers,
	callbackURL,
}: { headers: Headers; callbackURL: string }): string {
	// Check if we're in development mode
	const isDev = process.env.NODE_ENV !== "production";

	// For development, force localhost
	if (isDev) {
		const port = process.env.PORT ?? "3000"; // Default port
		const url = new URL(`http://localhost:${port}/api/auth/callback/yale-cas`);
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

async function getYalieByNetId({
	netId,
	apiKey,
}: {
	netId: string;
	apiKey: string;
}) {
	const { data, error } = await betterFetch("https://api.yalies.io/v2/people", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
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
