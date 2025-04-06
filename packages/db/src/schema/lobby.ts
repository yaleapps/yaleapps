import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const lobbyPresence = sqliteTable("lobby_presence", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
	lastPingAt: integer("last_ping_at", { mode: "timestamp" }).notNull(),
	conversationTopic: text("conversation_topic").notNull(),
	status: text("status", { enum: ["active", "inactive", "matched"] })
		.notNull()
		.default("active"),
});

export const lobbyHistory = sqliteTable("lobby_history", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
	leftAt: integer("left_at", { mode: "timestamp" }).notNull(),
	matchedWithUserId: text("matched_with_user_id").references(() => users.id),
	reason: text("reason", {
		enum: ["matched", "timeout", "left", "kicked"],
	}).notNull(),
});

// Add user profile fields needed for lobby
export const userProfiles = sqliteTable("user_profiles", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	college: text("college").notNull(),
	major: text("major").notNull(),
	year: text("year").notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
