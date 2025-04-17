import { type SeasonCode, getSeasonCodeForDate } from "@repo/db/utils";
import { type } from "arktype";
import {
	CourseFromCourseTableApi,
	type CourseSummary,
	type Professor,
	type SameCourseAndProfessorsId,
} from "src/types/types";
import { saveCourseOptions } from "./courses";
import { saveProfessorOptions } from "./professors";

const currentDate = new Date();
const fiveYearsAgo = new Date();
fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);
const fiveYearSeasonCodes = getSeasonCodesBetweenDates(
	fiveYearsAgo,
	currentDate,
);

const { professorOptions, courseOptions } =
	await generateProfessorAndCourseSelectOptionsForSeasonCodes(
		fiveYearSeasonCodes,
	);

await saveProfessorOptions(professorOptions);
await saveCourseOptions(courseOptions);

async function generateProfessorAndCourseSelectOptionsForSeasonCodes(
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
				same_course_id,
				same_course_and_profs_id,
				listings,
				title,
				description,
				course_professors,
				extra_info,
			} of out) {
				const hasNoProfessors = course_professors.length === 0;
				if (hasNoProfessors) continue;

				const isInactive = extra_info !== "ACTIVE";
				if (isInactive) continue;

				for (const { professor } of course_professors) {
					professorsMap.set(professor.professor_id, professor);
				}
				const courseSummary = {
					course_id,
					same_course_id,
					same_course_and_profs_id,
					course_codes: listings.map((l) => l.course_code),
					title,
					description,
					course_professors: course_professors.map(
						({ professor }) => professor,
					),
				} satisfies CourseSummary;
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
	const professorOptions = Array.from(professorsMap.values());
	professorOptions.sort((a, b) => a.professor_id - b.professor_id);
	const courseOptions = Array.from(coursesMap.values());
	courseOptions.sort((a, b) => a.course_id - b.course_id);
	return { professorOptions, courseOptions };
}

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
