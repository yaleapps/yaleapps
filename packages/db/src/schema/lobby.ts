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
});

export const matches = sqliteTableWithLobbyPrefix("matches", {
	id: integer().primaryKey({ autoIncrement: true }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

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
	matchId: integer("match_id").references(() => matches.id, {
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

export const matchesRelations = relations(matches, ({ many }) => ({
	participants: many(matchParticipants),
}));

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
		profile: one(lobbyProfiles, {
			fields: [matchParticipants.userId],
			references: [lobbyProfiles.userId],
		}),
	}),
);

export const lobbyInteractionsRelations = relations(
	lobbyHistory,
	({ one }) => ({
		user: one(users, {
			fields: [lobbyHistory.userId],
			references: [users.id],
		}),
		match: one(matches, {
			fields: [lobbyHistory.matchId],
			references: [matches.id],
		}),
	}),
);

export const lobbyProfilesRelations = relations(lobbyProfiles, ({ one }) => ({
	user: one(users, {
		fields: [lobbyProfiles.userId],
		references: [users.id],
	}),
}));
