import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./auth";
import { z } from "zod";
import { createPrefixedTableCreator } from "../utils";

const createSuperlativesTable = createPrefixedTableCreator("superlatives");

// Course type for JSON validation
const courseSchema = z.object({
	title: z.string(),
	same_course_id: z.number(),
	all_course_codes: z.array(z.string()),
});

type Course = z.infer<typeof courseSchema>;

export const userSuperlatives = createSuperlativesTable("results_2023-2024", {
	id: integer().primaryKey({ autoIncrement: true }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	email: text().notNull(),
	major: text({ mode: "json" }).$type<string[]>().notNull(),
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
	remarks: text(),
});

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
