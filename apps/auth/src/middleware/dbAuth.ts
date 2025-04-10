import type * as authSchema from "@repo/db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import type { Env } from "..";
import { createAuth } from "../better-auth/server";

declare module "hono" {
	interface ContextVariableMap {
		db: DrizzleD1Database<typeof authSchema>;
		auth: ReturnType<typeof createAuth>;
		user: ReturnType<typeof createAuth>["$Infer"]["Session"]["user"] | null;
		session:
			| ReturnType<typeof createAuth>["$Infer"]["Session"]["session"]
			| null;
	}
}

export const dbAuthMiddleware = createMiddleware<Env>(async (c, next) => {
	const db = drizzle<typeof authSchema>(c.env.DB);
	c.set("db", db);
	const auth = createAuth({ db, yaliesApiKey: c.env.YALIES_API_KEY });
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
