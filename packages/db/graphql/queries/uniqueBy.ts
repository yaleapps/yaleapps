import { graphql } from "gql.tada";
import { client } from "../client/urql";

const GetAllUniqueConceptualCourses = graphql(`
  query GetAllUniqueConceptualCourses {
  # Use distinct_on if your backend (likely Hasura) supports it
  # Order by the same field(s) used in distinct_on
  # Add a limit for managing response size
  courses(
    distinct_on: [same_course_id]
    order_by: { same_course_id: asc, season_code: desc } # Order by distinct field, then maybe newest offering
    limit: 50
  ) {
    # Core course identifiers
    course_id # ID of the specific offering returned
    same_course_id # The ID we used for distinctness
    title
    description

    # Load "other stuff" - Listings
    listings {
      subject
      number
      school
    }

    # Load "other stuff" - Professors
    course_professors {
      professor {
        name
      }
    }

    # Load "other stuff" - Season info
    season_code
    season {
      term
      year
    }

    # Add any other fields you need, e.g.:
    # average_rating
    # average_workload
    # areas
    # skills
    # course_meetings { start_time end_time days_of_week location { building { building_name } room } }
  }
}

`);

const result = await client
	.query(GetAllUniqueConceptualCourses, {})
	.toPromise();

console.log("🚀 ~ result:", result);
