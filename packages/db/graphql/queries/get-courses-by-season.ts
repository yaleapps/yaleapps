import { graphql } from "gql.tada";
import type { SeasonCode } from "../../utils/getSeasonCodeForDate";
import { client } from "../client/urql";

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

async function fetchDistinctCoursesBySeasonRange(
	seasonCodeStart: SeasonCode,
	seasonCodeEnd: SeasonCode,
) {
	const result = await client
		.query(GetDistinctCoursesBySeasonRange, {
			season_code_start: seasonCodeStart,
			season_code_end: seasonCodeEnd,
		})
		.toPromise();

	return result.data?.courses;
}

async function fetchDistinctCoursesBySeasonCode(seasonCode: string) {
	const result = await client
		.query(GetDistinctCoursesBySeason, {
			season_code: seasonCode,
		})
		.toPromise();

	return result.data?.courses;
}
