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
	joinedAt: integer("joined_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	lastPingedAt: integer("last_pinged_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	status: text({
		enum: ["active", "inactive", "matched", "matching"],
	})
		.notNull()
		.default("active"),
	matchedWithUserId: text("matched_with_user_id").references(() => users.id, {
		onDelete: "set null",
	}),
	hasAcceptedMatch: integer("has_accepted_match", { mode: "boolean" })
		.notNull()
		.default(false),
});

export const lobbyInteractions = sqliteTableWithLobbyPrefix("interactions", {
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
