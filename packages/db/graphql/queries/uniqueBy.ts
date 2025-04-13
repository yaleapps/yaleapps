import { graphql } from "gql.tada";
import { client } from "../client/urql";
import { promises as fs } from "node:fs";
import { getSeasonCodeForDate } from "../../utils/getSeasonCodeForDate";

const GetDistinctCoursesBySeasonRange = graphql(`
  query GetDistinctCoursesBySeasonRange($season_code_start: String!, $season_code_end: String!) {
    courses(
      where: {
        _and: [
          { season_code: { _gte: $season_code_start } }
          { season_code: { _lte: $season_code_end } }
        ]
      }
      distinct_on: [same_course_id]
      order_by: { same_course_id: asc, season_code: desc }
    ) {
      same_course_id
      title
      description
      course_professors {
        professor {
          name
        }
      }
    }
  }
`);

const GetDistinctCoursesBySeason = graphql(`
  query GetDistinctCoursesBySeason($season_code: String!) {
    courses(
      where: { season_code: { _eq: $season_code } }
      distinct_on: [same_course_id]
      order_by: { same_course_id: asc }
    ) {
      same_course_id
      title
      description
      course_professors {
        professor {
          name
        }
      }
    }
  }
`);

export async function fetchDistinctCoursesBySeasonRange(
	startDate: Date,
	endDate: Date,
) {
	const result = await client
		.query(GetDistinctCoursesBySeasonRange, {
			season_code_start: getSeasonCodeForDate(startDate),
			season_code_end: getSeasonCodeForDate(endDate),
		})
		.toPromise();

	return result.data?.courses;
}

export async function fetchDistinctCoursesBySeason(seasonCode: string) {
	const result = await client
		.query(GetDistinctCoursesBySeason, {
			season_code: seasonCode,
		})
		.toPromise();

	return result.data?.courses;
}

async function main() {
	const now = new Date();
	const fiveYearsAgo = new Date(
		now.getFullYear() - 5,
		now.getMonth(),
		now.getDate(),
	);

	const rangeResults = await fetchDistinctCoursesBySeasonRange(fiveYearsAgo, now);
	await fs.writeFile(
		"distinctCoursesByRange.json",
		JSON.stringify(rangeResults, null, 2),
	);
}

// Only run if this is the main module
if (require.main === module) {
	main().catch(console.error);
}
