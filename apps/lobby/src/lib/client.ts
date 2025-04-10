import { hc } from "hono/client";
import type { AppType } from "@repo/lobby-durable-object/app";

export const client = hc<AppType>("http://localhost:8787/", {
	fetch: ((input, init) => {
		return fetch(input, { ...init, credentials: "include" });
	}) satisfies typeof fetch,
});
