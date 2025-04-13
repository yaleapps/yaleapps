import { graphql } from "gql.tada";
import { client } from "../client/urql";
import { promises as fs } from "node:fs";
import {
	getSeasonCodeForDate,
	SeasonCode,
} from "../../utils/getSeasonCodeForDate";
import { type } from "arktype";

const SameCourseId = type("number#SameCourseId");
const SameCourseAndProfessorsId = type("number#SameCourseAndProfessorsId");

type CourseSummary = {
	same_course_and_profs_id: SameCourseAndProfessorsId;
	course_codes: string[];
	title: string;
	description: string;
	course_professors: Professor[];
};

const Professor = type({
	professor_id: "number",
	name: "string",
});

const CourseFromCourseTableApi = type({
	areas: "('Hu' | 'So' | 'Sc')[]",
	colsem: "boolean",
	course_id: "number",
	course_professors: type({
		professor: Professor,
	}).array(),
	credits: "number",
	description: "string",
	extra_info:
		"'ACTIVE' | 'CANCELLED' | 'CLOSED' | 'MOVED_TO_FALL_TERM' | 'MOVED_TO_SPRING_TERM'",
	final_exam: "string | null",
	fysem: "boolean",
	last_offered_course_id: "number | null",
	listings: type({
		course_code: "string",
		crn: "number",
		number: "string",
		school: "string",
		subject: "string",
	}).array(),
	primary_crn: "number | null",
	requirements: "string",
	same_course_and_profs_id: SameCourseAndProfessorsId,
	same_course_id: SameCourseId,
	season_code: "string",
	section: "string",
	skills: "('WR' | 'QR' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5')[]",
	title: "string",
	time_added: "string | null",
	last_updated: "string | null",
});

type SameCourseId = typeof SameCourseId.infer;
type SameCourseAndProfessorsId = typeof SameCourseAndProfessorsId.infer;
type CourseFromCourseTableApi = typeof CourseFromCourseTableApi.infer;
type Professor = typeof Professor.infer;

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

function getAllSeasonsFromFiveYearsAgoToNow() {
	const currentSeasonCode = getSeasonCodeForDate(new Date());

	const currentYear = Number.parseInt(currentSeasonCode.slice(0, 4));
	const currentSeason = currentSeasonCode.slice(4);

	const fiveYearsAgoYear = currentYear - 5;

	// Generate all season codes from 5 years ago up to now
	const seasonCodes: string[] = [];
	const seasons = ["01", "02", "03"] as const; // spring, summer, fall

	for (let year = fiveYearsAgoYear; year <= currentYear; year++) {
		for (const season of seasons) {
			const seasonCode = `${year}${season}`;
			// Only include seasons up to current season in current year
			if (year === currentYear && season > currentSeason) {
				break;
			}
			// Only include seasons from first season in start year
			if (year === fiveYearsAgoYear && season < seasons[0]) {
				continue;
			}
			seasonCodes.push(seasonCode);
		}
	}

	return seasonCodes;
}

const fiveYearSeasonCodes = getAllSeasonsFromFiveYearsAgoToNow();
async function getMapOfProfessorsAndCourses(seasonCodes: string[]) {
	const professorsMap = new Map<number, Professor>();
	const coursesMap = new Map<SameCourseAndProfessorsId, CourseSummary>();
	await Promise.all(
		seasonCodes.map(async (seasonCode) => {
			const res = await fetch(
				`https://api.coursetable.com/api/catalog/public/${seasonCode}`,
			);
			const data = await res.json();
			const out = CourseFromCourseTableApi.array()(data);
			if (out instanceof type.errors) {
				console.error(out.summary);
				throw new Error(out.summary);
			}
			for (const {
				course_id,
				same_course_and_profs_id,
				listings,
				title,
				description,
				course_professors,
			} of out) {
				for (const { professor } of course_professors) {
					professorsMap.set(professor.professor_id, professor);
				}
				const courseSummary = {
					course_id,
					same_course_and_profs_id,
					course_codes: listings.map((l) => l.course_code),
					title,
					description,
					course_professors: course_professors.map(
						({ professor }) => professor,
					),
				};
				if (coursesMap.has(same_course_and_profs_id)) {
					const existingCourseSummary = coursesMap.get(
						same_course_and_profs_id,
					) as CourseSummary;
					const newCourseCodes = courseSummary.course_codes.filter(
						(code) => !existingCourseSummary.course_codes.includes(code),
					);
					courseSummary.course_codes = [
						...existingCourseSummary.course_codes,
						...newCourseCodes,
					];
				}
				coursesMap.set(same_course_and_profs_id, courseSummary);
			}
		}),
	);
	return { professorsMap, coursesMap };
}

const { professorsMap, coursesMap } =
	await getMapOfProfessorsAndCourses(fiveYearSeasonCodes);

const professors = Array.from(professorsMap.values());
console.log("🚀 ~ professors:", professors);
const courses = Array.from(coursesMap.values());
console.log("🚀 ~ courses:", courses);
