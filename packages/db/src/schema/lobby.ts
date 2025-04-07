import { DINING_HALL_NAMES } from "@repo/constants";
import { type LobbyForm, VIBE_MAX_LENGTH } from "@/routes";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

// Prefix all tables with "lobby_" since they are specific to the lobby project
const sqliteTableWithLobbyPrefix = sqliteTableCreator(
	(name) => `lobby_${name}`,
);

export const lobbyParticipants = sqliteTableWithLobbyPrefix("participants", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	status: text("status", { enum: ["available", "pending_match"] })
		.notNull()
		.default("available"),
	joinedAt: integer("joined_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	currentMatchId: integer("current_match_id"),
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

export const activeMatches = sqliteTableWithLobbyPrefix("active_matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	user1LobbyId: text("user1_lobby_id")
		.notNull()
		.references(() => lobbyParticipants.id, { onDelete: "cascade" }),
	user2LobbyId: text("user2_lobby_id")
		.notNull()
		.references(() => lobbyParticipants.id, { onDelete: "cascade" }),
	user1Accepted: integer("user1_accepted", { mode: "boolean" }),
	user2Accepted: integer("user2_accepted", { mode: "boolean" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const lobbyRejections = sqliteTableWithLobbyPrefix("rejections", {
	id: integer().primaryKey({ autoIncrement: true }),
	sourceParticipantId: text("source_participant_id")
		.notNull()
		.references(() => lobbyParticipants.id, { onDelete: "cascade" }),
	targetParticipantId: text("target_participant_id")
		.notNull()
		.references(() => lobbyParticipants.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

// Relations
export const lobbyParticipantsRelations = relations(
	lobbyParticipants,
	({ one }) => ({
		user: one(users, {
			fields: [lobbyParticipants.userId],
			references: [users.id],
		}),
		profile: one(lobbyProfiles, {
			fields: [lobbyParticipants.id],
			references: [lobbyProfiles.userId],
		}),
	}),
);

export const activeMatchesRelations = relations(activeMatches, ({ one }) => ({
	user1: one(lobbyParticipants, {
		fields: [activeMatches.user1LobbyId],
		references: [lobbyParticipants.id],
	}),
	user2: one(lobbyParticipants, {
		fields: [activeMatches.user2LobbyId],
		references: [lobbyParticipants.id],
	}),
}));
