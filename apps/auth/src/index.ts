import { Hono } from "hono";
import { createDbAuthMiddleware } from "./middleware/dbAuth";
import { createCorsMiddleware } from "./middleware/cors";

export type Env = {
	Bindings: { DB: D1Database; YALIES_API_KEY: string };
};

export const app = new Hono<Env>();

app.use("*", createCorsMiddleware());

app.use(createDbAuthMiddleware());

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	const auth = c.get("auth");
	return auth.handler(c.req.raw);
});

export default app;
