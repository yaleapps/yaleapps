import { graphql } from "gql.tada";
import { client } from "../client/urql";
import fs from "node:fs";

const GetAllUniqueConceptualCourses = graphql(`
query GetAllUniqueConceptualCourses($season_code_start: String!, $season_code_end: String!) {
  courses(
    where: {
      _and: [
        { season_code: { _gte: $season_code_start } }
        { season_code: { _lte: $season_code_end } }
      ]
    }
    distinct_on: [same_course_id]
    order_by: { same_course_id: asc, season_code: desc } # Order by distinct field, then maybe newest offering
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

const result = await client
	.query(GetAllUniqueConceptualCourses, {
		season_code_start: "202501",
		season_code_end: "202503",
	})
	.toPromise();

// Save to file
fs.writeFileSync("uniqueBy.json", JSON.stringify(result, null, 2));
