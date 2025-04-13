import { DINING_HALL_NAMES } from "@repo/constants";
import {
	type LobbyProfileForm,
	VIBE_MAX_LENGTH,
} from "@repo/db/validators/lobby";
import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createPrefixedTableCreator } from "../utils";
import { users } from "./auth";

const createLobbyTable = createPrefixedTableCreator("lobby");

export const lobbyParticipantProfiles = createLobbyTable(
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

export const matches = createLobbyTable("matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const matchesRelations = relations(matches, ({ many }) => ({
	participants: many(matchParticipants),
}));

export const matchParticipants = createLobbyTable("match_participants", {
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
});

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
