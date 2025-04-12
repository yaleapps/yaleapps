const isProd = process.env.NODE_ENV === "production";

export const DOMAINS = {
	AUTH: isProd ? "https://auth.yaleapps.com" : "http://localhost:4343",
	LOBBY: isProd ? "https://lobby.yaleapps.com" : "http://localhost:3000",
	LOBBY_SERVER: isProd
		? "https://api.lobby.yaleapps.com"
		: "http://localhost:8787",
} as const;
