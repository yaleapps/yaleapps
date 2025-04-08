import { type LobbyForm, VIBE_MAX_LENGTH } from "@/routes";
import { DINING_HALL_NAMES } from "@repo/constants";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

// Prefix all tables with "lobby_" since they are specific to the lobby project
const sqliteTableWithLobbyPrefix = sqliteTableCreator(
	(name) => `lobby_${name}`,
);

export const lobbyParticipants = sqliteTableWithLobbyPrefix("participants", {
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

export const lobbyParticipantsRelations = relations(
	lobbyParticipants,
	({ one }) => ({
		user: one(users, {
			fields: [lobbyParticipants.userId],
			references: [users.id],
		}),
		profile: one(lobbyParticipantProfiles, {
			fields: [lobbyParticipants.userId],
			references: [lobbyParticipantProfiles.userId],
		}),
	}),
);

export const lobbyParticipantPreferences = sqliteTableWithLobbyPrefix(
	"participant_preferences",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		fromParticipantId: integer("from_participant_id")
			.notNull()
			.references(() => lobbyParticipants.id, { onDelete: "cascade" }),
		toParticipantId: integer("to_participant_id")
			.notNull()
			.references(() => lobbyParticipants.id, { onDelete: "cascade" }),
		preference: text("preference", {
			enum: ["interested", "not_interested"],
		}).notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
);

export const lobbyParticipantPreferencesRelations = relations(
	lobbyParticipantPreferences,
	({ one }) => ({
		fromParticipant: one(lobbyParticipants, {
			fields: [lobbyParticipantPreferences.fromParticipantId],
			references: [lobbyParticipants.id],
		}),
		toParticipant: one(lobbyParticipants, {
			fields: [lobbyParticipantPreferences.toParticipantId],
			references: [lobbyParticipants.id],
		}),
	}),
);

export const lobbyParticipantProfiles = sqliteTableWithLobbyPrefix(
	"participant_profiles",
	{
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
	},
);

export const lobbyParticipantProfilesRelations = relations(
	lobbyParticipantProfiles,
	({ one }) => ({
		user: one(users, {
			fields: [lobbyParticipantProfiles.userId],
			references: [users.id],
		}),
	}),
);

export const matches = sqliteTableWithLobbyPrefix("matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const matchesRelations = relations(matches, ({ many }) => ({
	participants: many(matchParticipants),
}));

export const matchParticipants = sqliteTableWithLobbyPrefix(
	"match_participants",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		matchId: integer("match_id")
			.notNull()
			.references(() => matches.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		joinedAt: integer("joined_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
);

export const matchParticipantsRelations = relations(
	matchParticipants,
	({ one }) => ({
		match: one(matches, {
			fields: [matchParticipants.matchId],
			references: [matches.id],
		}),
		user: one(users, {
			fields: [matchParticipants.userId],
			references: [users.id],
		}),
	}),
);
