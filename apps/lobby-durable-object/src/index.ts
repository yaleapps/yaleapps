import { DurableObject } from "cloudflare:workers";

type UserId = string;

type LobbyMember = {
	id: UserId;
	profile: {
		diningHall: string;
		year: string;
		vibes: string;
		phoneNumber: string;
	};
	preferences: Record<UserId, boolean>;
};

/** A Durable Object's behavior is defined in an exported Javascript class */
export class LobbyDurableObject extends DurableObject<Env> {
	lobby: LobbyMember[];

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.lobby = [];

		// Initialize state
		ctx.blockConcurrencyWhile(async () => {
			this.lobby = (await ctx.storage.get("lobby")) ?? [];
		});
	}

	private async persistState() {
		await this.ctx.storage.put("lobby", this.lobby);
	}

	async fetch(request: Request) {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);
		this.ctx.acceptWebSocket(server);
		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	/**
	 * Called automatically when a WebSocket receives a message from the client
	 */
	async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		ws.send(
			`[Durable Object] message: ${message}, connections: ${this.ctx.getWebSockets().length}`,
		);
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

	async join(member: LobbyMember) {
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
	}

	async leave(userId: UserId) {
		this.lobby = this.lobby.filter((m) => m.id !== userId);
		await this.persistState();
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
		const lobbyId: DurableObjectId =
			env.LOBBY_DURABLE_OBJECT.idFromName("Lobby");
		const lobby = env.LOBBY_DURABLE_OBJECT.get(lobbyId);
	},
} satisfies ExportedHandler<Env>;
