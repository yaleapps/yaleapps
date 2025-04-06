import * as authSchema from "@repo/db/schema";
import { yaleCas } from "@yaleapps/better-auth-yale-cas";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import type { Env } from "..";

/**
 * Creates a new server-side BetterAuth instance. Connects to the shared auth server and uses the given D1 database for storage.
 */
export function createAuth(env: Env["Bindings"]) {
	return betterAuth({
		baseURL: "http://localhost:8787",
		emailAndPassword: { enabled: true },
		trustedOrigins: ["http://localhost:3000"],
		database: drizzleAdapter(env.DB, {
			provider: "sqlite",
			schema: authSchema,
			usePlural: true,
		}),
		plugins: [
			yaleCas({
				yaliesApiKey: env.YALIES_API_KEY,
				authServerBaseUrl: "http://localhost:8787",
			}),
			anonymous({
				onLinkAccount: async ({ anonymousUser, newUser }) => {},
			}),
		],
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ["google", "github"],
			},
		},
		advanced: {
			crossSubDomainCookies: {
				enabled: true,
			},
		},
	});
}
