import { DINING_HALL_NAMES } from "@repo/constants";
import { type LobbyForm, VIBE_MAX_LENGTH } from "@/routes";
import { relations, sql } from "drizzle-orm";
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
	 * The timestamp when the user joined the lobby. Null when the user is not in the lobby.
	 */
	activeSince: integer("active_since", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

export const lobbyProfiles = sqliteTableWithLobbyPrefix("profiles", {
	userId: text("user_id")
		.notNull()
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

export const lobbyRejections = sqliteTableWithLobbyPrefix("rejections", {
	id: integer().primaryKey({ autoIncrement: true }),
	rejectingUserId: text("rejecting_user_id")
		.notNull()
		.references(() => tempLobbyUsers.id, { onDelete: "cascade" }),
	rejectedUserId: text("rejected_user_id")
		.notNull()
		.references(() => tempLobbyUsers.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const activeMatches = sqliteTableWithLobbyPrefix("active_matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	user1Id: text("user_1_id")
		.notNull()
		.references(() => tempLobbyUsers.id, { onDelete: "cascade" }),
	user2Id: text("user_2_id")
		.notNull()
		.references(() => tempLobbyUsers.id, { onDelete: "cascade" }),
	user1Status: text("user_1_status", {
		enum: ["pending", "accepted", "rejected"],
	})
		.notNull()
		.default("pending"),
	user2Status: text("user_2_status", {
		enum: ["pending", "accepted", "rejected"],
	})
		.notNull()
		.default("pending"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});
