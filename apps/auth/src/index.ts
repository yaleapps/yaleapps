import { Hono } from "hono";
import { cors } from "hono/cors";
import { dbAuthMiddleware } from "./services";
import { setupPassport } from "./services/passport";
import { casAuth } from "./cas-auth";

export type Bindings = { DB: D1Database };

export const app = new Hono<{ Bindings: Bindings }>();

app.use(
	"/api/auth/*", // or replace with "*" to enable cors for all routes
	cors({
		origin: "http://localhost:3000", // replace with your origin
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

app.get("/login", casAuth);

export default app;
