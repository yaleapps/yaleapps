import { DOMAINS } from "@repo/constants/urls";
import * as authSchema from "@repo/db/schema";
import { yaleCas } from "@yaleapps/better-auth-yale-cas";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import type { DrizzleD1Database } from "drizzle-orm/d1";

/**
 * Creates a new server-side BetterAuth instance. Connects to the shared auth server and uses the given D1 database for storage.
 */
export function createAuth({
	db,
	yaliesApiKey,
}: {
	db: DrizzleD1Database<typeof authSchema>;
	yaliesApiKey: string;
}) {
	return betterAuth({
		baseURL: DOMAINS.AUTH,
		emailAndPassword: { enabled: true },
		trustedOrigins: [DOMAINS.LOBBY],
		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema: authSchema,
			usePlural: true,
		}),
		plugins: [
			yaleCas({
				yaliesApiKey,
				authServerBaseUrl: DOMAINS.AUTH,
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
