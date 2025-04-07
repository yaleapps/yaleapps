import { DINING_HALL_NAMES } from "@repo/constants";
import { type LobbyForm, VIBE_MAX_LENGTH } from "@/routes";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

// Prefix all tables with "lobby_" since they are specific to the lobby project
const sqliteTableWithLobbyPrefix = sqliteTableCreator(
	(name) => `lobby_${name}`,
);

export const activeLobbyUsers = sqliteTableWithLobbyPrefix("active_users", {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	lastPingedAt: integer("last_pinged_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const matches = sqliteTableWithLobbyPrefix("matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	user1Id: text("user1_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	user2Id: text("user2_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	user1Status: text({
		enum: ["pending", "accepted", "rejected"],
	})
		.notNull()
		.default("pending"),
	user2Status: text({
		enum: ["pending", "accepted", "rejected"],
	})
		.notNull()
		.default("pending"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	expiresAt: integer("expires_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch() + 900)`), // 15 minutes by default
});

export const lobbyHistory = sqliteTableWithLobbyPrefix("interactions", {
	id: integer().primaryKey({ autoIncrement: true }),
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
	reason: text({
		enum: ["matched", "timeout", "left", "kicked"],
	}).notNull(),
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

export const matchesRelations = relations(matches, ({ one }) => ({
	user1: one(users, {
		fields: [matches.user1Id],
		references: [users.id],
	}),
	user2: one(users, {
		fields: [matches.user2Id],
		references: [users.id],
	}),
	user1Profile: one(lobbyProfiles, {
		fields: [matches.user1Id],
		references: [lobbyProfiles.userId],
	}),
	user2Profile: one(lobbyProfiles, {
		fields: [matches.user2Id],
		references: [lobbyProfiles.userId],
	}),
}));

export const lobbyInteractionsRelations = relations(
	lobbyHistory,
	({ one }) => ({
		user: one(users, {
			fields: [lobbyHistory.userId],
			references: [users.id],
		}),
		matchedWith: one(users, {
			fields: [lobbyHistory.matchedWithUserId],
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
