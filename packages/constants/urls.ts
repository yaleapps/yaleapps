/// <reference types="vite/client" />
/// <reference types="node" />
import { type } from "arktype";

const Mode = type("'development' | 'production'");
type Mode = typeof Mode.infer;

function getMode() {
	const rawMode =
		typeof import.meta !== "undefined" && import.meta.env.MODE !== undefined
			? import.meta.env.MODE
			: process.env.NODE_ENV;
	const mode = Mode(rawMode);
	if (mode instanceof type.errors) {
		console.error("❌ Invalid environment configuration", mode.summary);
		throw new Error("Invalid environment configuration");
	}
	return mode;
}

const isProd = getMode() === "production";

export const DOMAINS = {
	AUTH: isProd ? "https://auth.yaleapps.com" : "http://localhost:4343",
	LOBBY: isProd ? "https://lobby.yaleapps.com" : "http://localhost:3000",
	LOBBY_SERVER: isProd
		? "https://api.lobby.yaleapps.com"
		: "http://localhost:8787",
	LOBBY_SERVER_WS: isProd
		? "wss://api.lobby.yaleapps.com"
		: "ws://localhost:8787",
} as const;
