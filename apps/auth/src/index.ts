import type * as authSchema from "@repo/db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { dbAuthMiddleware } from "./services";
import type { createAuth } from "./services/createAuth";

export type Env = {
	Bindings: { DB: D1Database; YALIES_API_KEY: string };
	Variables: {
		db: DrizzleD1Database<typeof authSchema>;
		auth: ReturnType<typeof createAuth>;
		user: ReturnType<typeof createAuth>["$Infer"]["Session"]["user"] | null;
		session:
			| ReturnType<typeof createAuth>["$Infer"]["Session"]["session"]
			| null;
	};
};

export const app = new Hono<Env>();

app.use(
	"*",
	cors({
		origin: ["http://localhost:3000"],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use(dbAuthMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	const auth = c.get("auth");
	return auth.handler(c.req.raw);
});

export default app;
