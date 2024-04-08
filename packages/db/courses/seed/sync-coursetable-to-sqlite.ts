import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { getTableName } from 'drizzle-orm';
import { env } from '../../env';
import { db } from '../db';
import { graphql } from '../graphql';
import {
	course_flags,
	course_professors,
	courses,
	evaluation_narratives,
	evaluation_questions,
	evaluation_ratings,
	evaluation_statistics,
	flags,
	listings,
	professors,
	seasons,
} from '../schema';

const client = new Client({
	url: 'https://api.coursetable.com/ferry/v1/graphql',
	exchanges: [cacheExchange, fetchExchange],
	fetchOptions: () => ({
		headers: { Cookie: env.COURSETABLE_COOKIE, 'Content-Type': 'application/json' },
	}),
});

const BATCH_SIZE = 500;
const TABLES = [
	{
		table: seasons,
		query: graphql(`
			query seasons($offset: Int, $limit: Int) {
				seasons(offset: $offset, limit: $limit) {
					season_code
					term
					year
				}
			}
		`),
	},
	{
		table: evaluation_questions,
		query: graphql(`
			query evaluation_questions($offset: Int, $limit: Int) {
				evaluation_questions(offset: $offset, limit: $limit) {
					question_code
					is_narrative
					question_text
					options
					tag
				}
			}
		`),
	},
	{
		table: flags,
		query: graphql(`
			query flags($offset: Int, $limit: Int) {
				flags(offset: $offset, limit: $limit) {
					flag_id
					flag_text
				}
			}
		`),
	},
	{
		table: professors,
		query: graphql(`
			query professors($offset: Int, $limit: Int) {
				professors(offset: $offset, limit: $limit) {
					professor_id
					name
					email
					average_rating
					average_rating_n
				}
			}
		`),
	},
	{
		table: courses,
		query: graphql(`
			query courses($offset: Int, $limit: Int) {
				courses(offset: $offset, limit: $limit, order_by: { course_id: asc }) {
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
					last_enrollment_same_professors
				}
			}
		`),
	},
	{
		table: listings,
		query: graphql(`
			query listings($offset: Int, $limit: Int) {
				listings(offset: $offset, limit: $limit) {
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
			}
		`),
	},
	{
		table: evaluation_statistics,
		query: graphql(`
			query evaluation_statistics($offset: Int, $limit: Int) {
				evaluation_statistics(offset: $offset, limit: $limit) {
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
			}
		`),
	},
	{
		table: evaluation_narratives,
		query: graphql(`
			query evaluation_narratives($offset: Int, $limit: Int) {
				evaluation_narratives(offset: $offset, limit: $limit) {
					id
					course_id
					question_code
					comment
					comment_neg
					comment_neu
					comment_pos
					comment_compound
				}
			}
		`),
	},
	{
		table: evaluation_ratings,
		query: graphql(`
			query evaluation_ratings($offset: Int, $limit: Int) {
				evaluation_ratings(offset: $offset, limit: $limit) {
					id
					course_id
					question_code
					rating
				}
			}
		`),
	},
	{
		table: course_professors,
		query: graphql(`
			query course_professors($offset: Int, $limit: Int) {
				course_professors(offset: $offset, limit: $limit) {
					course_id
					professor_id
				}
			}
		`),
	},
	{
		table: course_flags,
		query: graphql(`
			query course_flags($offset: Int, $limit: Int) {
				course_flags(offset: $offset, limit: $limit) {
					course_id
					flag_id
				}
			}
		`),
	},
] as const;

export async function syncCourseTableToSqlite() {
	for (const { query, table } of TABLES) {
		const tableName = getTableName(table);
		const totalRows = await getTableLength(table);
		for (let offset = 0; offset < totalRows; offset += BATCH_SIZE) {
			const { data: batch, error } = await client.query(query, { offset, limit: BATCH_SIZE });
			if (!batch) {
				console.error(`Error fetching data for table ${tableName}:`, error);
				continue;
			}
			try {
				// @ts-ignore
				await db.insert(table).values(batch[tableName]).onConflictDoNothing();
			} catch (e) {
				console.error(`Error inserting data into table ${tableName}:`, e);
			}
		}
	}
}

async function getTableLength(table: (typeof TABLES)[number]['table']): Promise<number> {
	const tableName = getTableName(table);
	const tableNameAggregate = `${tableName}_aggregate` as const;
	const tableCountQuery = graphql(`query {
		${tableNameAggregate} {
			aggregate {
				count
			}
		}
	}`);
	const { data, error } = await client.query(tableCountQuery, {});
	if (!data) {
		console.error(`Error fetching data for table ${tableName}:`, error);
		return 0;
	}
	// @ts-ignore
	return data[tableNameAggregate].aggregate.count;
}
