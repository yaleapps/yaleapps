import {
	type LobbyProfileForm,
	VIBE_MAX_LENGTH,
} from "@repo/db/validators/lobby";
import { DINING_HALL_NAMES } from "@repo/constants";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

/**
 * Creates a table creator function that automatically prefixes all table names with 'lobby_'.
 * This is a Drizzle ORM pattern for managing multi-project schemas in a single database.
 *
 * Why use table prefixing?
 * 1. Namespace Isolation: Keeps lobby-related tables separate from other features
 * 2. Conflict Prevention: Avoids naming collisions in shared database environments
 * 3. Better Organization: Makes it easy to:
 *    - Filter tables in migrations (using tablesFilter: ["lobby_*"])
 *    - Identify related tables during database inspection
 *    - Group related features in database management tools
 *
 * Usage:
 * ```ts
 * const users = lobbyPrefixedSqliteTable('users', {
 *   id: integer('id').primaryKey(),
 *   // ... other columns
 * });
 * // Result: Creates a table named "lobby_users"
 * ```
 */
const lobbyPrefixedSqliteTable = sqliteTableCreator((name) => `lobby_${name}`);

export const lobbyParticipantProfiles = lobbyPrefixedSqliteTable(
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

export const matches = lobbyPrefixedSqliteTable("matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const matchesRelations = relations(matches, ({ many }) => ({
	participants: many(matchParticipants),
}));

export const matchParticipants = lobbyPrefixedSqliteTable(
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
