import {
	type LobbyProfileForm,
	VIBE_MAX_LENGTH,
} from "@repo/db/validators/lobby";
import { DINING_HALL_NAMES } from "@repo/constants";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

// Prefix all tables with "lobby_" since they are specific to the lobby project
const sqliteTableWithLobbyPrefix = sqliteTableCreator(
	(name) => `lobby_${name}`,
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
		} satisfies Record<keyof LobbyProfileForm, ReturnType<typeof text>>),

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
