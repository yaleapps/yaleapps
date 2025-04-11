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
	PREFERENCE_EXPIRATION_SECONDS,
	type UserId,
	createLobbyWsService,
	userIdSchema,
	wsMessageInSchema,
} from "./types";
import { DINING_HALL_NAMES } from "@repo/constants";
import type { PreferenceValue } from "./types";

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

			const targetUserId = "0DBZuv9rUkmsTQzCVoVkp0WRZ7NjRKN8" as UserId;
			this.lobby = Array.from(
				{ length: 20 },
				(_, i) =>
					({
						userId: `dummy-user-${i}` as UserId,
						profile: {
							diningHall: DINING_HALL_NAMES[i % DINING_HALL_NAMES.length],
							year: ["2024", "2025", "2026", "2027", "Graduate"][
								Math.floor(i / 4)
							],
							vibes: [
								"CS major looking for leetcode break buddies!",
								"History major with fascinating stories to share",
								"Pre-med student needing orgo study break",
								"Physics major exploring quantum lunch mechanics",
								"Math major calculating optimal conversation ratios",
								"Drama major rehearsing monologues over meals",
								"Philosophy major pondering lunch paradoxes",
								"Economics major analyzing lunch market efficiency",
								"Art major sketching while snacking",
								"English major writing lunch poetry",
							][i % 10],
							phoneNumber: `555${String(i).padStart(7, "0")}`,
						},
						preferences: {
							[targetUserId]: (() => {
								// Assign preferences in a deterministic pattern
								// Every third user "likes", every fourth "dislikes", rest have no preference
								if (i % 3 === 0) {
									return {
										value: "accept",
										expiresAt:
											Date.now() + PREFERENCE_EXPIRATION_SECONDS * 1000,
									};
								}
								if (i % 4 === 0) {
									return {
										value: "reject",
										expiresAt:
											Date.now() + PREFERENCE_EXPIRATION_SECONDS * 1000,
									};
								}
								return {
									value: "neutral",
									expiresAt: Date.now() + PREFERENCE_EXPIRATION_SECONDS * 1000,
								};
							})(),
						},
					}) satisfies LobbyParticipant,
			);
			await this.persistState();
		});
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

	private async cleanupExpiredPreferences() {
		let hasChanges = false;

		for (const participant of this.lobby) {
			const updatedPreferences: typeof participant.preferences = {};
			for (const [targetUserId, preference] of Object.entries(
				participant.preferences,
			)) {
				if (preference && preference.expiresAt > new Date().getTime()) {
					updatedPreferences[targetUserId as UserId] = preference;
				} else {
					hasChanges = true;
				}
			}
			participant.preferences = updatedPreferences;
		}

		if (hasChanges) {
			await this.persistState();
			await this.broadcastLobbyUpdate();
		}
	}

	private async join(userId: UserId) {
		await this.cleanupExpiredPreferences();
		const participantProfileFromDb =
			await this.db.query.lobbyParticipantProfiles.findFirst({
				where: eq(schema.lobbyParticipantProfiles.userId, userId),
			});

		if (!participantProfileFromDb) {
			throw new HTTPException(404, {
				message:
					"No user lobby profile found in database. Did they complete the lobby form?",
			});
		}

		const existingLobbyParticipantIndex = this.lobby.findIndex(
			(p) => p.userId === userId,
		);
		if (existingLobbyParticipantIndex < 0) {
			this.lobby.push({
				userId,
				profile: participantProfileFromDb,
				preferences: {},
			});
		} else {
			this.lobby[existingLobbyParticipantIndex] = {
				userId,
				profile: participantProfileFromDb,
				preferences: this.lobby[existingLobbyParticipantIndex].preferences,
			};
		}

		await this.persistState();
		await this.broadcastLobbyUpdate();
	}

	private async leave(userId: UserId) {
		await this.cleanupExpiredPreferences();
		this.removeLobbyParticipant(userId);
		await this.persistState();
		await this.broadcastLobbyUpdate();
	}

	async setParticipantPreference({
		fromUserId,
		targetUserId,
		preference,
	}: {
		fromUserId: UserId;
		targetUserId: UserId;
		preference: PreferenceValue["value"];
	}) {
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
			[targetUserId]: {
				value: preference,
				expiresAt: Date.now() + PREFERENCE_EXPIRATION_SECONDS * 1000,
			},
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
		await this.cleanupExpiredPreferences();
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
			.input(z.object({ id: userIdSchema }))
			.mutation(async ({ ctx, input }) => {
				const { id } = input;
				const lobbyId = ctx.env.LOBBY_DURABLE_OBJECT.idFromName(
					LOBBY_DURABLE_OBJECT_NAME,
				);
				const lobby = ctx.env.LOBBY_DURABLE_OBJECT.get(lobbyId);
				await lobby.setParticipantPreference({
					fromUserId: ctx.user.id as UserId,
					targetUserId: id,
					preference: "accept",
				});
			}),
		rejectParticipant: protectedProcedure
			.input(z.object({ id: userIdSchema }))
			.mutation(async ({ ctx, input }) => {
				const { id } = input;
				const lobbyId = ctx.env.LOBBY_DURABLE_OBJECT.idFromName(
					LOBBY_DURABLE_OBJECT_NAME,
				);
				const lobby = ctx.env.LOBBY_DURABLE_OBJECT.get(lobbyId);
				await lobby.setParticipantPreference({
					fromUserId: ctx.user.id as UserId,
					targetUserId: id,
					preference: "reject",
				});
			}),
		cancelAcceptParticipant: protectedProcedure
			.input(z.object({ id: userIdSchema }))
			.mutation(async ({ ctx, input }) => {
				const { id } = input;
				const lobbyId = ctx.env.LOBBY_DURABLE_OBJECT.idFromName(
					LOBBY_DURABLE_OBJECT_NAME,
				);
				const lobby = ctx.env.LOBBY_DURABLE_OBJECT.get(lobbyId);
				await lobby.setParticipantPreference({
					fromUserId: ctx.user.id as UserId,
					targetUserId: id,
					preference: "neutral",
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
