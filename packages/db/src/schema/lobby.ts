import { RESIDENTIAL_COLLEGE_ABBREVIATIONS } from "@repo/constants";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

// Prefix all tables with "lobby_" since they are specific to the lobby project
const sqliteTableWithLobbyPrefix = sqliteTableCreator(
	(name) => `lobby_${name}`,
);

export const activeLobbyUsers = sqliteTableWithLobbyPrefix("active_users", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	joinedAt: integer("joined_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	lastPingAt: integer("last_ping_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	conversationTopic: text("conversation_topic").notNull(),
	status: text("status", { enum: ["active", "inactive", "matched"] })
		.notNull()
		.default("active"),
});

export const lobbyInteractions = sqliteTableWithLobbyPrefix("interactions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	joinedAt: integer("joined_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	leftAt: integer("left_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	matchedWithUserId: text("matched_with_user_id").references(() => users.id, {
		onDelete: "set null",
	}),
	reason: text("reason", {
		enum: ["matched", "timeout", "left", "kicked"],
	}).notNull(),
});

export const lobbyProfiles = sqliteTableWithLobbyPrefix("profiles", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	diningHall: text("dining_hall", {
		enum: RESIDENTIAL_COLLEGE_ABBREVIATIONS,
	}).notNull(),
	major: text("major").notNull(),
	year: text("year").notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const activeLobbyUsersRelations = relations(
	activeLobbyUsers,
	({ one }) => ({
		user: one(users, {
			fields: [activeLobbyUsers.userId],
			references: [users.id],
		}),
		profile: one(lobbyProfiles, {
			fields: [activeLobbyUsers.userId],
			references: [lobbyProfiles.userId],
		}),
	}),
);

export const lobbyInteractionsRelations = relations(
	lobbyInteractions,
	({ one }) => ({
		user: one(users, {
			fields: [lobbyInteractions.userId],
			references: [users.id],
		}),
		matchedWith: one(users, {
			fields: [lobbyInteractions.matchedWithUserId],
			references: [users.id],
			relationName: "matched_user",
		}),
	}),
);

export const lobbyProfilesRelations = relations(lobbyProfiles, ({ one }) => ({
	user: one(users, {
		fields: [lobbyProfiles.userId],
		references: [users.id],
	}),
}));
