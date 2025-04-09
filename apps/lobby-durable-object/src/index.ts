import { DurableObject } from "cloudflare:workers";
import { incomingClientWsMessageSchema, type LobbyParticipant } from "./types";

/** A Durable Object's behavior is defined in an exported Javascript class */
export class LobbyDurableObject extends DurableObject<Env> {
	lobby: LobbyParticipant[];

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.lobby = [];
		ctx.blockConcurrencyWhile(async () => {
			this.lobby = (await ctx.storage.get("lobby")) ?? [];
		});
	}

	async fetch() {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);
		this.ctx.acceptWebSocket(server);
		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	private async persistState() {
		await this.ctx.storage.put("lobby", this.lobby);
	}

	/**
	 * Broadcasts the current lobby state to all connected clients
	 */
	private async broadcastLobbyUpdate() {
		const connections = this.ctx.getWebSockets();

		const message = JSON.stringify({
			type: "LOBBY_UPDATE",
			lobby: this.lobby,
		});

		for (const ws of connections) {
			try {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(message);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	/**
	 * Called automatically when a WebSocket receives a message from the client
	 */
	async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		try {
			if (typeof message !== "string") return;
			const data = JSON.parse(message);
			const validatedMessageResult =
				incomingClientWsMessageSchema.safeParse(data);
			if (!validatedMessageResult.success) {
				ws.send(
					JSON.stringify({
						type: "ERROR",
						error: `Invalid message format: ${validatedMessageResult.error.message}`,
					}),
				);
				return;
			}

			const validatedMessage = validatedMessageResult.data;

			switch (validatedMessage.type) {
				case "JOIN":
					await this.join(validatedMessage.participant);
					break;
				case "LEAVE":
					await this.leave(validatedMessage.userId);
					break;
				case "GET_LOBBY":
					ws.send(
						JSON.stringify({
							type: "LOBBY_UPDATE",
							lobby: this.lobby,
						}),
					);
					break;
			}
		} catch (error) {
			ws.send(
				JSON.stringify({
					type: "ERROR",
					error: "Failed to parse message",
				}),
			);
		}
	}

	/**
	 * Called automatically when a WebSocket connection is closed
	 */
	webSocketClose(
		ws: WebSocket,
		code: number,
		reason: string,
		wasClean: boolean,
	): void | Promise<void> {}

	/**
	 * Called automatically when a WebSocket connection encounters a non-disconnect error
	 */
	webSocketError(ws: WebSocket, error: unknown): void | Promise<void> {}

	async join(member: LobbyParticipant) {
		const existingIndex = this.lobby.findIndex((m) => m.id === member.id);
		if (existingIndex >= 0) {
			this.lobby[existingIndex] = {
				...member,
				preferences: this.lobby[existingIndex].preferences,
			};
		} else {
			this.lobby.push({ ...member, preferences: {} });
		}
		await this.persistState();
		// Broadcast the update to all connected clients
		await this.broadcastLobbyUpdate();
	}

	async leave(userId: UserId) {
		this.lobby = this.lobby.filter((m) => m.id !== userId);
		await this.persistState();
		// Broadcast the update to all connected clients
		await this.broadcastLobbyUpdate();
	}

	async getMembers() {
		return this.lobby;
	}
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		const lobbyId = env.LOBBY_DURABLE_OBJECT.idFromName("Lobby");
		const lobby = env.LOBBY_DURABLE_OBJECT.get(lobbyId);
		return lobby.fetch(request);
	},
} satisfies ExportedHandler<Env>;
