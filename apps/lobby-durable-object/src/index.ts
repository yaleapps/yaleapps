import { DurableObject, env } from "cloudflare:workers";
import { trpcServer } from "@hono/trpc-server";
import { createAuth } from "@repo/auth/better-auth/server";
import { createCorsMiddleware } from "@repo/auth/middleware/cors";
import * as schema from "@repo/db/schema";
import { lobbyParticipantProfiles } from "@repo/db/schema";
import { buildConflictUpdateColumns } from "@repo/db/utils";
import { lobbyProfileFormSchema } from "@repo/db/validators/lobby";
import { TRPCError, type TRPCRouterRecord, initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import superjson from "superjson";
import { z } from "zod";
import {
	type LobbyParticipant,
	type UserId,
	createLobbyWsService,
	wsMessageInSchema,
} from "./types";

const LOBBY_DURABLE_OBJECT_NAME = "Lobby";
const LOBBY_DURABLE_OBJECT_STORAGE_KEY = "lobby";

type Env = {
	DB: D1Database;
	LOBBY_DURABLE_OBJECT: DurableObjectNamespace<Lobby>;
	YALIES_API_KEY: string;
};

type HonoEnv = { Bindings: Env };

/** A Durable Object's behavior is defined in an exported Javascript class */
export class Lobby extends DurableObject<Env> {
	lobby: LobbyParticipant[];
	db: DrizzleD1Database<typeof schema>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.db = drizzle(env.DB, { schema, logger: true });
		this.lobby = [];
		ctx.blockConcurrencyWhile(async () => {
			this.lobby =
				(await ctx.storage.get(LOBBY_DURABLE_OBJECT_STORAGE_KEY)) ?? [];
		});
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

	private removeLobbyParticipant(userId: UserId) {
		this.lobby = this.lobby.filter((p) => p.userId !== userId);
	}

	async getLobby() {
		return this.lobby;
	}

	private async persistState() {
		await this.ctx.storage.put(LOBBY_DURABLE_OBJECT_STORAGE_KEY, this.lobby);
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

	async setParticipantPreference({
		fromUserId,
		targetUserId,
		preference,
	}: { fromUserId: UserId; targetUserId: UserId; preference: boolean }) {
		const participant = this.lobby.find((p) => p.userId === fromUserId);
		if (!participant) {
			throw new HTTPException(404, {
				message: "User not found in lobby",
			});
		}

		const targetParticipant = this.lobby.find((p) => p.userId === targetUserId);
		if (!targetParticipant) {
			throw new HTTPException(404, {
				message: "Target participant not found in lobby",
			});
		}

		participant.preferences = {
			...participant.preferences,
			[targetUserId]: preference,
		};

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

function createContext({ req }: FetchCreateContextFnOptions) {
	return { req };
}

type Context = ReturnType<typeof createContext>;

const t = initTRPC
	.context<{ env: Env } & Context>()
	.create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(async ({ ctx, next }) => {
	const db = drizzle(ctx.env.DB, { schema, logger: true });
	const auth = createAuth({ db, yaliesApiKey: ctx.env.YALIES_API_KEY });

	return next({ ctx: { ...ctx, db, auth } });
});

/**
 * Protected procedure that checks if the user is logged in.
 */
const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
	const session = await ctx.auth.api.getSession({
		headers: ctx.req.headers,
	});
	if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

	return next({
		ctx: { ...ctx, session: session.session, user: session.user },
	});
});

export const trpcRouter = createTRPCRouter({
	lobby: {
		getLobbyParticipants: publicProcedure.query(async ({ ctx }) => {
			const lobbyId = ctx.env.LOBBY_DURABLE_OBJECT.idFromName(
				LOBBY_DURABLE_OBJECT_NAME,
			);
			const lobby = ctx.env.LOBBY_DURABLE_OBJECT.get(lobbyId);

			const lobbyParticipants = await lobby.getLobby();
			return lobbyParticipants as LobbyParticipant[];
		}),
		getLobbyProfileById: publicProcedure.query(async ({ ctx }) => {
			const session = await ctx.auth.api.getSession({
				headers: ctx.req.headers,
			});
			if (!session) return null;
			const lobbyProfile =
				await ctx.db.query.lobbyParticipantProfiles.findFirst({
					where: eq(lobbyParticipantProfiles.userId, session.user.id),
				});
			return lobbyProfile ?? null;
		}),
		upsertLobbyProfile: protectedProcedure
			.input(z.object({ profile: lobbyProfileFormSchema }))
			.mutation(async ({ ctx, input }) => {
				const { profile } = input;
				await ctx.db
					.insert(lobbyParticipantProfiles)
					.values({ userId: ctx.user.id, ...profile, updatedAt: new Date() })
					.onConflictDoUpdate({
						target: [lobbyParticipantProfiles.userId],
						set: buildConflictUpdateColumns(lobbyParticipantProfiles, [
							"year",
							"diningHall",
							"vibes",
							"phoneNumber",
							"updatedAt",
						]),
					});
			}),
		acceptParticipant: protectedProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }) => {
				const { id } = input;
				const lobbyId = ctx.env.LOBBY_DURABLE_OBJECT.idFromName(
					LOBBY_DURABLE_OBJECT_NAME,
				);
				const lobby = ctx.env.LOBBY_DURABLE_OBJECT.get(lobbyId);
				await lobby.setParticipantPreference({
					fromUserId: ctx.user.id as UserId,
					targetUserId: id as UserId,
					preference: true,
				});
			}),
		rejectParticipant: protectedProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }) => {
				const { id } = input;
				const lobbyId = ctx.env.LOBBY_DURABLE_OBJECT.idFromName(
					LOBBY_DURABLE_OBJECT_NAME,
				);
				const lobby = ctx.env.LOBBY_DURABLE_OBJECT.get(lobbyId);
				await lobby.setParticipantPreference({
					fromUserId: ctx.user.id as UserId,
					targetUserId: id as UserId,
					preference: false,
				});
			}),
	},
} satisfies TRPCRouterRecord);

export type TRPCRouter = typeof trpcRouter;

const app = new Hono<HonoEnv>()
	.use("*", createCorsMiddleware())
	.use("/trpc/*", trpcServer({ router: trpcRouter, createContext }));

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const clonedRequest = request.clone();
		if (clonedRequest.url.includes("/ws")) {
			const lobbyId = env.LOBBY_DURABLE_OBJECT.idFromName(
				LOBBY_DURABLE_OBJECT_NAME,
			);
			const lobby = env.LOBBY_DURABLE_OBJECT.get(lobbyId);

			return lobby.fetch(request);
		}

		return app.fetch(clonedRequest, env, ctx);
	},
} satisfies ExportedHandler<Env>;
