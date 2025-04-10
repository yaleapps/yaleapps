import * as schema from "@repo/db/schema";
import { createAuth } from "@repo/auth/createAuth";
import { DurableObject } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	type LobbyParticipant,
	type UserId,
	createLobbyWsService,
	wsMessageInSchema,
} from "./types";

type Bindings = {
	DB: D1Database;
	LOBBY_DURABLE_OBJECT: DurableObjectNamespace<Lobby>;
};

export type Env = {
	Bindings: Bindings;
	// Variables: {
	// 	db: DrizzleD1Database<typeof authSchema>;
	// 	auth: ReturnType<typeof createAuth>;
	// 	user: ReturnType<typeof createAuth>["$Infer"]["Session"]["user"] | null;
	// 	session:
	// 		| ReturnType<typeof createAuth>["$Infer"]["Session"]["session"]
	// 		| null;
	// };
};

/** A Durable Object's behavior is defined in an exported Javascript class */
export class Lobby extends DurableObject<Bindings> {
	lobby: LobbyParticipant[];

	constructor(ctx: DurableObjectState, env: Bindings) {
		super(ctx, env);

		this.lobby = [];
		ctx.blockConcurrencyWhile(async () => {
			this.lobby = (await ctx.storage.get("lobby")) ?? [];
		});
	}

	private removeLobbyParticipant(userId: UserId) {
		this.lobby = this.lobby.filter((p) => p.userId !== userId);
	}

	private upsertLobbyParticipant(lobbyParticipant: LobbyParticipant) {
		const existingLobbyParticipantIndex = this.lobby.findIndex(
			(p) => p.userId === lobbyParticipant.userId,
		);
		if (existingLobbyParticipantIndex >= 0) {
			this.lobby[existingLobbyParticipantIndex] = lobbyParticipant;
		} else {
			this.lobby.push(lobbyParticipant);
		}
	}

	private async persistState() {
		await this.ctx.storage.put("lobby", this.lobby);
	}

	/**
	 * Broadcasts the current lobby state to all connected clients
	 */
	private async broadcastLobbyUpdate() {
		const connections = this.ctx.getWebSockets();

		for (const ws of connections) {
			const wsService = createLobbyWsService(ws);
			try {
				if (ws.readyState === WebSocket.OPEN) {
					wsService.sendLobbyUpdate(this.lobby);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	private async join(userId: UserId) {
		const db = drizzle(this.env.DB, { schema });

		const savedLobbyParticipantProfile =
			await db.query.lobbyParticipantProfiles.findFirst({
				where: eq(schema.lobbyParticipantProfiles.userId, userId),
			});

		if (!savedLobbyParticipantProfile) {
			throw new HTTPException(404, {
				message:
					"No user lobby profile found in database. Did they complete the lobby form?",
			});
		}

		const lobbyParticipant = {
			userId,
			profile: savedLobbyParticipantProfile,
			preferences: {},
		} satisfies LobbyParticipant;

		this.upsertLobbyParticipant(lobbyParticipant);
		await this.persistState();
		await this.broadcastLobbyUpdate();
	}

	private async leave(userId: UserId) {
		this.removeLobbyParticipant(userId);
		await this.persistState();
		await this.broadcastLobbyUpdate();
	}

	async fetch(request: Request): Promise<Response> {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		this.ctx.acceptWebSocket(server);

		return new Response(null, { status: 101, webSocket: client });
	}

	/**
	 * Called automatically when a WebSocket receives a message from the client
	 */
	async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		const wsService = createLobbyWsService(ws);
		try {
			if (typeof message !== "string") return;
			const validatedMessage = wsMessageInSchema.parse(JSON.parse(message));

			switch (validatedMessage.type) {
				case "JOIN":
					await this.join(validatedMessage.userId);
					break;
				case "LEAVE":
					await this.leave(validatedMessage.userId);
					break;
				case "GET_LOBBY":
					wsService.sendLobbyUpdate(this.lobby);
					break;
			}
		} catch (error) {
			wsService.sendError(
				`Failed to parse message: ${(error as Error).message}`,
			);
		}
	}
}

const app = new Hono<Env>();

app.get("/", (c) => c.text("Hello World"));

app.get("/joinAndGetLobby", async (c) => {
	const userId = c.req.query("userId");
	if (!userId) throw new HTTPException(400, { message: "User ID is required" });

	const lobbyId = c.env.LOBBY_DURABLE_OBJECT.idFromName("Lobby");
	const lobby = c.env.LOBBY_DURABLE_OBJECT.get(lobbyId);

	return lobby.fetch(c.req.raw);
});

export default app;
