import { zValidator } from "@hono/zod-validator";
import { createCorsMiddleware } from "@repo/auth/middleware/cors";
import { createDbAuthMiddleware } from "@repo/auth/middleware/dbAuth";
import * as schema from "@repo/db/schema";
import { buildConflictUpdateColumns } from "@repo/db/utils";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";
import { DurableObject } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	type LobbyParticipant,
	type UserId,
	createLobbyWsService,
	userIdSchema,
	wsMessageInSchema,
} from "./types";
import { z } from "zod";

type Bindings = {
	DB: D1Database;
	LOBBY_DURABLE_OBJECT: DurableObjectNamespace<Lobby>;
};

export type Env = { Bindings: Bindings };

/** A Durable Object's behavior is defined in an exported Javascript class */
export class Lobby extends DurableObject<Bindings> {
	lobby: LobbyParticipant[];
	db: DrizzleD1Database<typeof schema>;

	constructor(ctx: DurableObjectState, env: Bindings) {
		super(ctx, env);
		this.db = drizzle(env.DB, { schema, logger: true });
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
		const savedLobbyParticipantProfile =
			await this.db.query.lobbyParticipantProfiles.findFirst({
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
			wsService.sendError(` ${(error as Error).message}`);
		}
	}
}

const app = new Hono<Env>()
	.use("*", createCorsMiddleware())
	.use(createDbAuthMiddleware())
	.get(
		"/getLobbyProfileById",
		zValidator("form", z.object({ userId: userIdSchema })),
		async (c) => {
			const { userId } = c.req.valid("form");

			const db = drizzle(c.env.DB, { schema, logger: true });

			const lobbyProfile = await db.query.lobbyParticipantProfiles.findFirst({
				where: eq(schema.lobbyParticipantProfiles.userId, userId),
			});

			return c.json({ lobbyProfile });
		},
	)
	.post(
		"/upsertLobbyProfile",
		zValidator("form", lobbyProfileFormSchema),
		async (c) => {
			const userId = c.get("user")?.id as UserId;
			if (!userId) throw new HTTPException(401, { message: "Unauthorized" });

			const profile = c.req.valid("form");

			const db = drizzle(c.env.DB, { schema, logger: true });

			await db
				.insert(schema.lobbyParticipantProfiles)
				.values({
					userId,
					...profile,
					updatedAt: new Date(),
				})
				.onConflictDoUpdate({
					target: [schema.lobbyParticipantProfiles.userId],
					set: buildConflictUpdateColumns(schema.lobbyParticipantProfiles, [
						"diningHall",
						"year",
						"vibes",
						"phoneNumber",
						"updatedAt",
					]),
				});

			return c.json({ success: true });
		},
	);

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.url.includes("/ws")) {
			const lobbyId = env.LOBBY_DURABLE_OBJECT.idFromName("Lobby");
			const lobby = env.LOBBY_DURABLE_OBJECT.get(lobbyId);

			return lobby.fetch(request);
		}

		return app.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env["Bindings"]>;

export type AppType = typeof app;
