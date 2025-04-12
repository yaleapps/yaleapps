/// <reference types="node" />

export const DEV_DOMAINS = {
	AUTH: "http://localhost:4343",
	LOBBY: "http://localhost:3000",
	LOBBY_SERVER: "http://localhost:8787",
	LOBBY_SERVER_WS: "ws://localhost:8787",
} as const;

export const PROD_DOMAINS = {
	AUTH: "https://auth.yaleapps.com",
	LOBBY: "https://lobby.yaleapps.com",
	LOBBY_SERVER: "https://api-lobby.yaleapps.com",
	LOBBY_SERVER_WS: "wss://api-lobby.yaleapps.com",
} as const;

const isDev = false;
export const DOMAINS = isDev ? DEV_DOMAINS : PROD_DOMAINS;
