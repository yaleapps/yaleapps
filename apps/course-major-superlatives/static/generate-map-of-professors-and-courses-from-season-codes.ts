import { type SeasonCode, getSeasonCodeForDate } from "@repo/db/utils";
import { type } from "arktype";
import { promises as fs } from "node:fs";

const SameCourseId = type("number#SameCourseId");
const SameCourseAndProfessorsId = type("number#SameCourseAndProfessorsId");

export type CourseSummary = {
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

function getSeasonCodesBetweenDates(
	startDate: Date,
	endDate: Date,
): SeasonCode[] {
	const startSeasonCode = getSeasonCodeForDate(startDate);
	const endSeasonCode = getSeasonCodeForDate(endDate);

	const startYear = Number.parseInt(startSeasonCode.slice(0, 4));
	const endYear = Number.parseInt(endSeasonCode.slice(0, 4));
	const startSeason = startSeasonCode.slice(4);
	const endSeason = endSeasonCode.slice(4);

	const seasonCodes: SeasonCode[] = [];
	const seasons = ["01", "02", "03"] as const; // spring, summer, fall

	for (let year = startYear; year <= endYear; year++) {
		for (const season of seasons) {
			const seasonCode = `${year}${season}` as SeasonCode;
			// Skip seasons before start season in start year
			if (year === startYear && season < startSeason) {
				continue;
			}
			// Skip seasons after end season in end year
			if (year === endYear && season > endSeason) {
				break;
			}
			seasonCodes.push(seasonCode);
		}
	}

	return seasonCodes;
}

async function generateMapOfProfessorsAndCoursesFromSeasonCodes(
	seasonCodes: string[],
) {
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

const currentDate = new Date();
const fiveYearsAgo = new Date();
fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);
const fiveYearSeasonCodes = getSeasonCodesBetweenDates(
	fiveYearsAgo,
	currentDate,
);

const { professorsMap, coursesMap } =
	await generateMapOfProfessorsAndCoursesFromSeasonCodes(fiveYearSeasonCodes);

async function saveProfessorMap(professorsMap: Map<number, Professor>) {
	const professors = Array.from(professorsMap.entries());
	await fs.writeFile(
		"apps/course-major-superlatives/static/professors.json",
		JSON.stringify(professors),
	);
}

export async function getProfessorMap() {
	const professors = await fs.readFile(
		"https://github.com/yaleapps/yaleapps/blob/main/apps/course-major-superlatives/static/professors.json",
		"utf-8",
	);
	return new Map(JSON.parse(professors)) as Map<number, Professor>;
}

async function saveCoursesMap(
	coursesMap: Map<SameCourseAndProfessorsId, CourseSummary>,
) {
	const courses = Array.from(coursesMap.entries());
	await fs.writeFile(
		"apps/course-major-superlatives/static/courses.json",
		JSON.stringify(courses),
	);
}

export async function getCoursesMap() {
	const courses = await fs.readFile(
		"https://github.com/yaleapps/yaleapps/blob/main/apps/course-major-superlatives/static/professors.json",
		"utf-8",
	);
	return new Map(JSON.parse(courses)) as Map<
		SameCourseAndProfessorsId,
		CourseSummary
	>;
}

await saveProfessorMap(professorsMap);
await saveCoursesMap(coursesMap);
