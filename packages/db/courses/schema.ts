import { relations, type InferSelectModel } from 'drizzle-orm';
import {
	index,
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const seasons = sqliteTable('seasons', {
	season_code: text('season_code').primaryKey(),
	term: text('term'),
	year: integer('year'),
});

export const seasonsRelations = relations(seasons, ({ many }) => ({
	courses: many(courses),
	listings: many(listings),
}));

export const insertSeasonSchema = createInsertSchema(seasons);

export const allCourseColumnNames = [
	'course_id',
	'season_code',
	'title',
	'short_title',
	'description',
	'requirements',
	'locations_summary',
	'times_long_summary',
	'times_summary',
	'times_by_day',
	'skills',
	'areas',
	'credits',
	'syllabus_url',
	'course_home_url',
	'regnotes',
	'extra_info',
	'rp_attr',
	'classnotes',
	'final_exam',
	'fysem',
	'sysem',
	'colsem',
	'average_rating',
	'average_rating_n',
	'average_workload',
	'average_workload_n',
	'average_rating_same_professors',
	'average_rating_same_professors_n',
	'average_workload_same_professors',
	'average_workload_same_professors_n',
	'last_offered_course_id',
	'same_course_id',
	'same_course_and_profs_id',
	'last_enrollment_course_id',
	'last_enrollment',
	'last_enrollment_season_code',
	'average_comment_neg',
	'average_comment_neg_n',
	'average_comment_neu',
	'average_comment_neu_n',
	'average_comment_pos',
	'average_comment_pos_n',
	'average_comment_compound',
	'average_comment_compound_n',
] as const;

export const courses = sqliteTable('courses', {
	course_id: integer('course_id').primaryKey(),
	season_code: text('season_code').notNull(),
	// .references(() => seasons.season_code),
	title: text('title'),
	short_title: text('short_title'),
	description: text('description'),
	requirements: text('requirements'),
	locations_summary: text('locations_summary'),
	times_long_summary: text('times_long_summary'),
	times_summary: text('times_summary'),
	// times_by_day":{"Monday":[["14:30","15:45","WLH 113","https://map.yale.edu/place/building/WLH?"]],"Wednesday":[["14:30","15:45","WLH 113","https://map.yale.edu/place/building/WLH?"]]}
	times_by_day: text('times_by_day', { mode: 'json' }).$type<Record<string, string[][]>>(),
	skills: text('skills', { mode: 'json' }).$type<string[]>(),
	areas: text('areas', { mode: 'json' }).$type<string[]>(),
	credits: real('credits'),
	syllabus_url: text('syllabus_url'),
	course_home_url: text('course_home_url'),
	regnotes: text('regnotes'),
	extra_info: text('extra_info'),
	rp_attr: text('rp_attr'),
	classnotes: text('classnotes'),
	final_exam: text('final_exam'),
	fysem: integer('fysem', { mode: 'boolean' }),
	sysem: integer('sysem', { mode: 'boolean' }),
	colsem: integer('colsem', { mode: 'boolean' }),
	average_rating: real('average_rating'),
	average_rating_n: integer('average_rating_n'),
	average_workload: real('average_workload'),
	average_workload_n: integer('average_workload_n'),
	average_rating_same_professors: real('average_rating_same_professors'),
	average_rating_same_professors_n: integer('average_rating_same_professors_n'),
	average_workload_same_professors: real('average_workload_same_professors'),
	average_workload_same_professors_n: integer('average_workload_same_professors_n'),
	last_offered_course_id: integer('last_offered_course_id'),
	// .references(() => courses.course_id),
	same_course_id: integer('same_course_id').notNull(),
	same_course_and_profs_id: integer('same_course_and_profs_id').notNull(),
	last_enrollment_course_id: integer('last_enrollment_course_id'),
	// .references(() => courses.course_id),
	last_enrollment: integer('last_enrollment'),
	last_enrollment_season_code: text('last_enrollment_season_code'),
	// .references(() => seasons.season_code),
	average_comment_neg: real('average_comment_neg'),
	average_comment_neg_n: integer('average_comment_neg_n'),
	average_comment_neu: real('average_comment_neu'),
	average_comment_neu_n: integer('average_comment_neu_n'),
	average_comment_pos: real('average_comment_pos'),
	average_comment_pos_n: integer('average_comment_pos_n'),
	average_comment_compound: real('average_comment_compound'),
	average_comment_compound_n: integer('average_comment_compound_n'),
} satisfies Record<(typeof allCourseColumnNames)[number], unknown>);

export type SelectCourse = InferSelectModel<typeof courses>;

export const coursesRelations = relations(courses, ({ one, many }) => ({
	season: one(seasons, {
		fields: [courses.season_code],
		references: [seasons.season_code],
	}),
	lastOfferedCourse: one(courses, {
		fields: [courses.last_offered_course_id],
		references: [courses.course_id],
	}),
	lastOfferedCourses: many(courses),
	// TODO: Verify does same_course_id actually reference courses.course_id? If so, uncomment this out
	// sameCourse: one(courses, {
	// 	fields: [courses.same_course_id],
	// 	references: [courses.course_id],
	// }),
	// TODO: Verify does same_course_and_profs_id actually reference courses.course_id? If so, uncomment this out
	// sameCourseAndProfs: one(courses, {
	// 	fields: [courses.same_course_and_profs_id],
	// 	references: [courses.course_id],
	// }),
	lastEnrollmentCourse: one(courses, {
		fields: [courses.last_enrollment_course_id],
		references: [courses.course_id],
	}),
	lastEnrollmentCourses: many(courses),
	lastEnrollmentSeason: one(seasons, {
		fields: [courses.last_enrollment_season_code],
		references: [seasons.season_code],
	}),
	listings: many(listings),
	courseFlags: many(course_flags),
	demandStatistics: many(demand_statistics),
	evaluationStatistics: many(evaluation_statistics),
	evaluationNarratives: many(evaluation_narratives),
	evaluationRatings: many(evaluation_ratings),
	courseProfessors: many(course_professors),
	courseDiscussions: many(course_discussions),
	fasttextSimilarsSource: many(fasttext_similars),
	fasttextSimilarsTarget: many(fasttext_similars),
	tfidfSimilarsSource: many(tfidf_similars),
	tfidfSimilarsTarget: many(tfidf_similars),
}));

export const insertCourseSchema = createInsertSchema(courses, {
	times_by_day: z.record(z.string().array().array()),
	skills: z.string().array(),
	areas: z.string().array(),
});

export const listings = sqliteTable(
	'listings',
	{
		listing_id: integer('listing_id').primaryKey(),
		course_id: integer('course_id').notNull(),
		// .references(() => courses.course_id),
		school: text('school'),
		subject: text('subject').notNull(),
		number: text('number').notNull(),
		course_code: text('course_code'),
		section: text('section').notNull(),
		season_code: text('season_code').notNull(),
		// .references(() => seasons.season_code),
		crn: integer('crn').notNull(),
	},
	(table) => {
		return {
			idx_season_code_crn_unique: uniqueIndex('idx_season_code_crn_unique').on(
				table.season_code,
				table.crn,
			),
			idx_seasonCourseSection_unique: index('idx_season_course_section_unique').on(
				table.season_code,
				table.subject,
				table.number,
				table.section,
			),
		};
	},
);

export const listingsRelations = relations(listings, ({ one }) => ({
	course: one(courses, {
		fields: [listings.course_id],
		references: [courses.course_id],
	}),
	season: one(seasons, {
		fields: [listings.season_code],
		references: [seasons.season_code],
	}),
}));

export const insertListingSchema = createInsertSchema(listings);

export const discussions = sqliteTable('discussions', {
	discussion_id: integer('discussion_id').primaryKey(),
	subject: text('subject').notNull(),
	number: text('number').notNull(),
	info: text('info'),
	locations_summary: text('locations_summary'),
	times_long_summary: text('times_long_summary'),
	times_summary: text('times_summary'),
	times_by_day: text('times_by_day'),
});

export const discussionsRelations = relations(discussions, ({ many }) => ({
	courseDiscussions: many(course_discussions),
}));

export const insertDiscussionSchema = createInsertSchema(discussions);

export const flags = sqliteTable('flags', {
	flag_id: integer('flag_id').primaryKey(),
	flag_text: text('flag_text').notNull(),
});

export const flagsRelations = relations(flags, ({ many }) => ({
	courseFlags: many(course_flags),
}));

export const insertFlagSchema = createInsertSchema(flags);

export const demand_statistics = sqliteTable('demand_statistics', {
	course_id: integer('course_id').primaryKey(),
	// .references(() => courses.course_id),
	latest_demand: integer('latest_demand'),
	latest_demand_date: text('latest_demand_date'),
	demand: text('demand', { mode: 'json' }),
});

export const demandStatisticsRelations = relations(demand_statistics, ({ one }) => ({
	course: one(courses),
}));

export const insertDemandStatisticsSchema = createInsertSchema(demand_statistics, {
	demand: z.record(z.string()),
});

export const professors = sqliteTable('professors', {
	professor_id: integer('professor_id').primaryKey(),
	name: text('name').notNull(),
	email: text('email'),
	average_rating: real('average_rating'),
	average_rating_n: integer('average_rating_n'),
});

export const professorsRelations = relations(professors, ({ many }) => ({
	courseProfessors: many(course_professors),
}));

export const insertProfessorSchema = createInsertSchema(professors);

export const evaluation_statistics = sqliteTable('evaluation_statistics', {
	course_id: integer('course_id').primaryKey(),
	// .references(() => courses.course_id),
	enrollment: integer('enrollment'),
	enrolled: integer('enrolled'),
	responses: integer('responses'),
	declined: integer('declined'),
	no_response: integer('no_response'),
	extras: text('extras'),
	avg_rating: real('avg_rating'),
	avg_workload: real('avg_workload'),
});

export const evaluationStatisticsRelations = relations(evaluation_statistics, ({ one }) => ({
	course: one(courses),
}));

export const insertEvaluationStatisticsSchema = createInsertSchema(evaluation_statistics);

export const evaluation_questions = sqliteTable('evaluation_questions', {
	question_code: text('question_code').primaryKey(),
	is_narrative: integer('is_narrative', { mode: 'boolean' }),
	question_text: text('question_text'),
	options: text('options', { mode: 'json' }).$type<string[]>(),
	tag: text('tag'),
});

export const evaluation_questions_relations = relations(evaluation_questions, ({ many }) => ({
	evaluationNarratives: many(evaluation_narratives),
	evaluationRatings: many(evaluation_ratings),
}));

export const insertEvaluationQuestionSchema = createInsertSchema(evaluation_questions, {
	options: z.string().array(),
});

export const evaluation_narratives = sqliteTable('evaluation_narratives', {
	id: integer('id').primaryKey(),
	course_id: integer('course_id').notNull(),
	// .references(() => courses.course_id),
	question_code: text('question_code').notNull(),
	// .references(() => evaluation_questions.question_code),
	comment: text('comment'),
	comment_neg: real('comment_neg'),
	comment_neu: real('comment_neu'),
	comment_pos: real('comment_pos'),
	comment_compound: real('comment_compound'),
});

export const evaluationNarrativesRelations = relations(evaluation_narratives, ({ one }) => ({
	course: one(courses, {
		fields: [evaluation_narratives.course_id],
		references: [courses.course_id],
	}),
	question: one(evaluation_questions, {
		fields: [evaluation_narratives.question_code],
		references: [evaluation_questions.question_code],
	}),
}));

export const insertEvaluationNarrativeSchema = createInsertSchema(evaluation_narratives);

export const evaluation_ratings = sqliteTable('evaluation_ratings', {
	id: integer('id').primaryKey(),
	course_id: integer('course_id').notNull(),
	// .references(() => courses.course_id),
	question_code: text('question_code').notNull(),
	// .references(() => evaluation_questions.question_code),
	rating: text('rating', { mode: 'json' }).$type<number[]>(),
});

export const evaluationRatingsRelations = relations(evaluation_ratings, ({ one }) => ({
	course: one(courses, {
		fields: [evaluation_ratings.course_id],
		references: [courses.course_id],
	}),
	question: one(evaluation_questions, {
		fields: [evaluation_ratings.question_code],
		references: [evaluation_questions.question_code],
	}),
}));

export const insertEvaluationRatingSchema = createInsertSchema(evaluation_ratings, {
	rating: z.number().array(),
});

export const course_professors = sqliteTable(
	'course_professors',
	{
		course_id: integer('course_id'),
		// .references(() => courses.course_id),
		professor_id: integer('professor_id'),
		// .references(() => professors.professor_id),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.course_id, table.professor_id],
				name: 'course_professors_course_id_professor_id_pk',
			}),
		};
	},
);

export const courseProfessorsRelations = relations(course_professors, ({ one }) => ({
	course: one(courses, {
		fields: [course_professors.course_id],
		references: [courses.course_id],
	}),
	professor: one(professors, {
		fields: [course_professors.professor_id],
		references: [professors.professor_id],
	}),
}));

export const insertCourseProfessorSchema = createInsertSchema(course_professors);

export const course_discussions = sqliteTable(
	'course_discussions',
	{
		course_id: integer('course_id'),
		// .references(() => courses.course_id),
		discussion_id: integer('discussion_id'),
		// .references(() => discussions.discussion_id),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.course_id, table.discussion_id],
				name: 'course_discussions_course_id_discussion_id_pk',
			}),
		};
	},
);

export const courseDiscussionsRelations = relations(course_discussions, ({ one }) => ({
	course: one(courses, {
		fields: [course_discussions.course_id],
		references: [courses.course_id],
	}),
	discussion: one(discussions, {
		fields: [course_discussions.discussion_id],
		references: [discussions.discussion_id],
	}),
}));

export const insertCourseDiscussionSchema = createInsertSchema(course_discussions);

export const course_flags = sqliteTable(
	'course_flags',
	{
		course_id: integer('course_id'),
		// .references(() => courses.course_id),
		flag_id: integer('flag_id'),
		// .references(() => flags.flag_id),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.course_id, table.flag_id],
				name: 'course_flags_course_id_flag_id_pk',
			}),
		};
	},
);

export const courseFlagsRelations = relations(course_flags, ({ one }) => ({
	course: one(courses, {
		fields: [course_flags.course_id],
		references: [courses.course_id],
	}),
	flag: one(flags, {
		fields: [course_flags.flag_id],
		references: [flags.flag_id],
	}),
}));

export const insertCourseFlagSchema = createInsertSchema(course_flags);

export const fasttext_similars = sqliteTable(
	'fasttext_similars',
	{
		source: integer('source'),
		// .references(() => courses.course_id),
		target: integer('target'),
		// .references(() => courses.course_id),
		rank: integer('rank'),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.source, table.target],
				name: 'fasttext_similars_source_target_pk',
			}),
		};
	},
);

export const fasttextSimilarsRelations = relations(fasttext_similars, ({ one }) => ({
	sourceCourse: one(courses, {
		fields: [fasttext_similars.source],
		references: [courses.course_id],
	}),
	targetCourse: one(courses, {
		fields: [fasttext_similars.target],
		references: [courses.course_id],
	}),
}));

export const insertFasttextSimilarSchema = createInsertSchema(fasttext_similars);

export const tfidf_similars = sqliteTable(
	'tfidf_similars',
	{
		source: integer('source'),
		// .references(() => courses.course_id),
		target: integer('target'),
		// .references(() => courses.course_id),
		rank: integer('rank'),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.source, table.target],
				name: 'tfidf_similars_source_target_pk',
			}),
		};
	},
);

export const tfidfSimilarsRelations = relations(tfidf_similars, ({ one }) => ({
	sourceCourse: one(courses, {
		fields: [tfidf_similars.source],
		references: [courses.course_id],
	}),
	targetCourse: one(courses, {
		fields: [tfidf_similars.target],
		references: [courses.course_id],
	}),
}));

export const insertTfidfSimilarSchema = createInsertSchema(tfidf_similars);
