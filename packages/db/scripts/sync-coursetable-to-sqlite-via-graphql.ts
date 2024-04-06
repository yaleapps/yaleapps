import { z } from 'zod';
import {
	course_discussions,
	course_flags,
	course_professors,
	courses,
	demand_statistics,
	discussions,
	evaluation_narratives,
	evaluation_questions,
	evaluation_ratings,
	evaluation_statistics,
	fasttext_similars,
	flags,
	insertCourseDiscussionSchema,
	insertCourseFlagSchema,
	insertCourseProfessorSchema,
	insertCourseSchema,
	insertDemandStatisticsSchema,
	insertDiscussionSchema,
	insertEvaluationNarrativeSchema,
	insertEvaluationQuestionSchema,
	insertEvaluationRatingSchema,
	insertEvaluationStatisticsSchema,
	insertFasttextSimilarSchema,
	insertFlagSchema,
	insertListingSchema,
	insertProfessorSchema,
	insertSeasonSchema,
	insertTfidfSimilarSchema,
	listings,
	professors,
	seasons,
	tfidf_similars,
} from '../schema';
import { db } from '../db';
import { env } from '../../../apps/reviews/src/env';
import { graphql } from 'gql.tada';

const BATCH_SIZE = 500;
const TABLES = [
	{
		name: 'seasons',
		query: graphql(`
			query Seasons($offset: Int, $limit: Int) {
				seasons(offset: $offset, limit: $limit) {
					season_code
					term
					year
				}
			}
		`),
		table: seasons,
		schema: z.object({ seasons: insertSeasonSchema.array() }).transform(({ seasons }) => seasons),
	},
	{
		name: 'courses',
		query: `query ($offset: Int, $limit: Int) {
			courses (offset: $offset, limit: $limit) {
				course_id
				season_code
				title
				short_title
				description
				requirements
				locations_summary
				times_long_summary
				times_summary
				times_by_day
				skills
				areas
				credits
				syllabus_url
				course_home_url
				regnotes
				extra_info
				rp_attr
				classnotes
				final_exam
				fysem
				sysem
				colsem
				average_rating
				average_rating_n
				average_workload
				average_workload_n
				average_rating_same_professors
				average_rating_same_professors_n
				average_workload_same_professors
				average_workload_same_professors_n
				last_offered_course_id
				same_course_id
				same_course_and_profs_id
				last_enrollment_course_id
				last_enrollment
				last_enrollment_season_code
			}
		}`,
		table: courses,
		schema: z.object({ courses: insertCourseSchema.array() }).transform(({ courses }) => courses),
	},
	{
		name: 'listings',
		query: `query ($offset: Int, $limit: Int) {
			listings (offset: $offset, limit: $limit) {
				listing_id
				course_id
				school
				subject
				number
				course_code
				section
				season_code
				crn
			}
		}`,
		table: listings,
		schema: z
			.object({ listings: insertListingSchema.array() })
			.transform(({ listings }) => listings),
	},
	{
		name: 'discussions',
		query: `query ($offset: Int, $limit: Int) {
			discussions (offset: $offset, limit: $limit) {
				discussion_id
				subject
				number
				info
				locations_summary
				times_long_summary
				times_summary
				times_by_day
			}
		}`,
		table: discussions,
		schema: z
			.object({ discussions: insertDiscussionSchema.array() })
			.transform(({ discussions }) => discussions),
	},
	{
		name: 'flags',
		query: `query ($offset: Int, $limit: Int) {
			flags (offset: $offset, limit: $limit) {
				flag_id
				flag_text
			}
		}`,
		table: flags,
		schema: z.object({ flags: insertFlagSchema.array() }).transform(({ flags }) => flags),
	},
	{
		name: 'demand_statistics',
		query: `query ($offset: Int, $limit: Int) {
			demand_statistics (offset: $offset, limit: $limit) {
				course_id
				latest_demand
				latest_demand_date
				demand
			}
		}`,
		table: demand_statistics,
		schema: z
			.object({ demand_statistics: insertDemandStatisticsSchema.array() })
			.transform(({ demand_statistics }) => demand_statistics),
	},
	{
		name: 'professors',
		query: `query ($offset: Int, $limit: Int) {
			professors (offset: $offset, limit: $limit) {
				professor_id
				name
				email
				average_rating
				average_rating_n
			}
		}`,
		table: professors,
		schema: z
			.object({ professors: insertProfessorSchema.array() })
			.transform(({ professors }) => professors),
	},
	{
		name: 'evaluation_statistics',
		query: `query ($offset: Int, $limit: Int) {
			evaluation_statistics (offset: $offset, limit: $limit) {
				course_id
				enrollment
				enrolled
				responses
				declined
				no_response
				extras
				avg_rating
				avg_workload
			}
		}`,
		table: evaluation_statistics,
		schema: z
			.object({ evaluation_statistics: insertEvaluationStatisticsSchema.array() })
			.transform(({ evaluation_statistics }) => evaluation_statistics),
	},
	{
		name: 'evaluation_questions',
		query: `query ($offset: Int, $limit: Int) {
			evaluation_questions (offset: $offset, limit: $limit) {
				question_code
				is_narrative
				question_text
				options
				tag
			}
		}`,
		table: evaluation_questions,
		schema: z
			.object({ evaluation_questions: insertEvaluationQuestionSchema.array() })
			.transform(({ evaluation_questions }) => evaluation_questions),
	},
	{
		name: 'evaluation_narratives',
		query: `query ($offset: Int, $limit: Int) {
			evaluation_narratives (offset: $offset, limit: $limit) {
				id
				course_id
				question_code
				comment
				comment_neg
				comment_neu
				comment_pos
				comment_compound
			}
		}`,
		table: evaluation_narratives,
		schema: z
			.object({ evaluation_narratives: insertEvaluationNarrativeSchema.array() })
			.transform(({ evaluation_narratives }) => evaluation_narratives),
	},
	{
		name: 'evaluation_ratings',
		query: `query ($offset: Int, $limit: Int) {
			evaluation_ratings (offset: $offset, limit: $limit) {
				id
				course_id
				question_code
				rating
			}
		}`,
		table: evaluation_ratings,
		schema: z
			.object({ evaluation_ratings: insertEvaluationRatingSchema.array() })
			.transform(({ evaluation_ratings }) => evaluation_ratings),
	},
	{
		name: 'course_professors',
		query: `query ($offset: Int, $limit: Int) {
			course_professors (offset: $offset, limit: $limit) {
				course_id
				professor_id
			}
		}`,
		table: course_professors,
		schema: z
			.object({ course_professors: insertCourseProfessorSchema.array() })
			.transform(({ course_professors }) => course_professors),
	},
	{
		name: 'course_discussions',
		query: `query ($offset: Int, $limit: Int) {
			course_discussions (offset: $offset, limit: $limit) {
				course_id
				discussion_id
			}
		}`,
		table: course_discussions,
		schema: z
			.object({ course_discussions: insertCourseDiscussionSchema.array() })
			.transform(({ course_discussions }) => course_discussions),
	},
	{
		name: 'course_flags',
		query: `query ($offset: Int, $limit: Int) {
			course_flags (offset: $offset, limit: $limit) {
				course_id
				flag_id
			}
		}`,
		table: course_flags,
		schema: z
			.object({ course_flags: insertCourseFlagSchema.array() })
			.transform(({ course_flags }) => course_flags),
	},
	{
		name: 'fasttext_similars',
		query: `query ($offset: Int, $limit: Int) {
			fasttext_similars (offset: $offset, limit: $limit) {
				source
				target
				rank
			}
		}`,
		table: fasttext_similars,
		schema: z
			.object({ fasttext_similars: insertFasttextSimilarSchema.array() })
			.transform(({ fasttext_similars }) => fasttext_similars),
	},
	{
		name: 'tfidf_similars',
		query: `query ($offset: Int, $limit: Int) {
			tfidf_similars (offset: $offset, limit: $limit) {
				source
				target
				rank
			}
		}`,
		table: tfidf_similars,
		schema: z
			.object({ tfidf_similars: insertTfidfSimilarSchema.array() })
			.transform(({ tfidf_similars }) => tfidf_similars),
	},
] as const;

type Table = (typeof TABLES)[number];
type TableName = Table['name'];

export async function syncCourseTableToSqlite() {
	try {
		const tablesWithLength = await Promise.all(
			TABLES.map(async (table) => ({ ...table, totalRows: await getTableLength(table.name) })),
		);
		for (const { query, schema, table, totalRows } of tablesWithLength) {
			for (let offset = 0; offset < totalRows; offset += BATCH_SIZE) {
				const batchData = await fetchGraphQl({
					query,
					schema,
					variables: { offset, limit: BATCH_SIZE },
				});
				if (!batchData) break;
				try {
					await db.insert(table).values(batchData).onConflictDoNothing();
				} catch (e) {
					console.error('Error inserting batchData', e, batchData);
				}
			}
		}
	} catch (e) {
		console.error(e);
	}
}

async function getTableLength(tableName: TableName): Promise<number> {
	const tableNameAggregate = `${tableName}_aggregate` as const;
	const tableCountQuery = `query {
		${tableNameAggregate} {
			aggregate {
				count
			}
		}
	}`;
	const data = await fetchGraphQl({
		query: tableCountQuery,
		schema: z.object({
			[tableNameAggregate]: z.object({
				aggregate: z.object({
					count: z.number(),
				}),
			}),
		}),
		variables: {},
	});
	if (!data) throw new Error(`getTableLength: count query returns undefined for ${tableName}`);
	return data[tableNameAggregate].aggregate.count;
}

async function fetchGraphQl<T extends z.ZodTypeAny>({
	query,
	schema,
	variables,
}: {
	query: string;
	schema: T;
	variables: Record<string, number>;
}) {
	const response = await fetch('https://api.coursetable.com/ferry/v1/graphql', {
		method: 'POST',
		headers: {
			cookie: env.COURSETABLE_COOKIE,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query, variables }),
	});
	const json = await response.json();
	try {
		const parsedResponse = z.object({ data: schema }).parse(json);
		return parsedResponse.data;
	} catch (e) {
		console.error(JSON.stringify(e).slice(0, 1000), JSON.stringify(json).slice(0, 1000));
	}
}
