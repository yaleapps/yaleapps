import { relations, sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./auth";
import { z } from "zod";

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
const superlatives20232024PrefixedSqliteTable = sqliteTableCreator(
	(name) => `superlatives_2023-2024_${name}`,
);

// Course type for JSON validation
const courseSchema = z.object({
	title: z.string(),
	same_course_id: z.number(),
	all_course_codes: z.array(z.string()),
});

type Course = z.infer<typeof courseSchema>;

export const userSuperlatives = superlatives20232024PrefixedSqliteTable(
	"user_superlatives",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		email: text("email").notNull(),
		major: text("major", { mode: "json" }).$type<string[]>().notNull(),
		selectedFavoriteProfessors: text("selected_favorite_professors", {
			mode: "json",
		})
			.$type<string[]>()
			.notNull(),
		selectedFavoriteCourses: text("selected_favorite_courses", { mode: "json" })
			.$type<z.infer<typeof courseSchema>[]>()
			.notNull(),
		selectedGuttiestCourses: text("selected_guttiest_courses", { mode: "json" })
			.$type<Course[]>()
			.notNull(),
		selectedFavoriteMajorCourses: text("selected_favorite_major_courses", {
			mode: "json",
		})
			.$type<Course[]>()
			.notNull(),
		selectedFavoriteDistributionalCourses: text(
			"selected_favorite_distributional_courses",
			{ mode: "json" },
		)
			.$type<Course[]>()
			.notNull(),
		selectedFavoriteLectureCourses: text("selected_favorite_lecture_courses", {
			mode: "json",
		})
			.$type<Course[]>()
			.notNull(),
		selectedFavoriteSeminarCourses: text("selected_favorite_seminar_courses", {
			mode: "json",
		})
			.$type<Course[]>()
			.notNull(),
		remarks: text("remarks"),
	},
);

// Relations with auth users table
export const userSuperlativesRelations = relations(
	userSuperlatives,
	({ one }) => ({
		user: one(users, {
			fields: [userSuperlatives.email],
			references: [users.email],
		}),
	}),
);

// Types
export type UserSuperlatives = InferSelectModel<typeof userSuperlatives>;
export type NewUserSuperlatives = InferInsertModel<typeof userSuperlatives>;

// Zod Schema for validation
export const insertUserSuperlativesSchema =
	createInsertSchema(userSuperlatives);
export const selectUserSuperlativesSchema =
	createSelectSchema(userSuperlatives);
