import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import type { Env } from "..";
import * as authSchema from "../db/schema";
import { yaleCas } from "../yale-cas/yale-cas-plugin";

export const dbAuthMiddleware = createMiddleware<Env>(async (c, next) => {
	const db = drizzle<typeof authSchema>(c.env.DB);
	c.set("db", db);
	const auth = betterAuth({
		baseURL: "http://localhost:8787",
		emailAndPassword: { enabled: true },
		trustedOrigins: ["http://localhost:3000", "http://localhost:8787"],
		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema: authSchema,
			usePlural: true,
		}),
		plugins: [
			yaleCas({
				yaliesApiKey: c.env.YALIES_API_KEY,
				authServerBaseUrl: "http://localhost:8787",
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
				// domain: ".yaleapps.com",
			},
		},
	});
	c.set("auth", auth);
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});
