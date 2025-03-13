import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "..";

declare module "hono" {
	interface ContextVariableMap {
		db: DrizzleD1Database<Record<string, never>>;
		auth: ReturnType<typeof betterAuth>;
	}
}

export const dbAuthMiddleware = createMiddleware<{ Bindings: Bindings }>(
	async (c, next) => {
		const db = drizzle(c.env.DB);
		c.set("db", db);
		const auth = betterAuth({
			database: drizzleAdapter(db, {
				provider: "sqlite",
			}),
		});
		c.set("auth", auth);
		await next();
	},
);
