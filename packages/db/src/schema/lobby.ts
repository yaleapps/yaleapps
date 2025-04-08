import { type LobbyForm, VIBE_MAX_LENGTH } from "@/routes";
import { DINING_HALL_NAMES } from "@repo/constants";
import { sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

// Prefix all tables with "lobby_" since they are specific to the lobby project
const sqliteTableWithLobbyPrefix = sqliteTableCreator(
	(name) => `lobby_${name}`,
);

export const tempLobbyUsers = sqliteTableWithLobbyPrefix("users", {
	/**
	 * The id of the user in the lobby.
	 */
	id: integer().primaryKey({ autoIncrement: true }),
	/**
	 * The id of the user in the auth schema.
	 */
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	/**
	 * The timestamp when the user joined the lobby
	 */
	joinedAt: integer("joined_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

export const lobbyProfiles = sqliteTableWithLobbyPrefix("profiles", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),

	...({
		vibes: text({ length: VIBE_MAX_LENGTH }).notNull(),
		diningHall: text("dining_hall", {
			enum: DINING_HALL_NAMES,
		}).notNull(),
		year: text().notNull(),
		phoneNumber: text("phone_number").notNull(),
	} satisfies Record<keyof LobbyForm, ReturnType<typeof text>>),

	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const lobbyResponses = sqliteTableWithLobbyPrefix("responses", {
	id: integer().primaryKey({ autoIncrement: true }),
	fromUserId: text("from_user_id")
		.notNull()
		.references(() => tempLobbyUsers.id, { onDelete: "cascade" }),
	toUserId: text("to_user_id")
		.notNull()
		.references(() => tempLobbyUsers.id, { onDelete: "cascade" }),
	response: text("response", { enum: ["accepted", "rejected"] }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});
