import { Hono } from "hono";
import { dbAuthMiddleware } from "./services";

export type Bindings = { DB: D1Database };

export const app = new Hono<{ Bindings: Bindings }>();

app.use(dbAuthMiddleware);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;
