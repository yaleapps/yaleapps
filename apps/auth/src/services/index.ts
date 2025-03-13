import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "..";
import * as authSchema from "../db/schema";

declare module "hono" {
	interface ContextVariableMap {
		db: DrizzleD1Database<typeof authSchema>;
		auth: ReturnType<typeof betterAuth>;
	}
}

export const dbAuthMiddleware = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		const db = drizzle<typeof authSchema>(c.env.DB);
		c.set("db", db);
		const auth = betterAuth({
			emailAndPassword: { enabled: true },
			trustedOrigins: ["http://localhost:3000"],
			database: drizzleAdapter(db, {
				provider: "sqlite",
				schema: authSchema,
				usePlural: true,
			}),
			advanced: {
				crossSubDomainCookies: {
					enabled: true,
					domain: ".yaleapps.com",
				},
			},
		});
		c.set("auth", auth);
		await next();
	},
);
