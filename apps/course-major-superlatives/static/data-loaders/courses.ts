import type {
	CourseSummary,
	SameCourseAndProfessorsId,
} from "../../src/types/types";

const year = new Date().getFullYear();

export async function saveCoursesMap(
	coursesMap: Map<SameCourseAndProfessorsId, CourseSummary>,
) {
	const { promises: fs } = await import("node:fs");
	const courses = Array.from(coursesMap.entries());
	courses.sort((a, b) => a[0] - b[0]);
	await fs.writeFile(
		`apps/course-major-superlatives/static/${year}-course-options.json`,
		JSON.stringify(courses),
	);
}

export async function getCoursesMap() {
	const res = await fetch(
		`https://raw.githubusercontent.com/yaleapps/yaleapps/refs/heads/main/apps/course-major-superlatives/static/${year}-course-options.json`,
	);
	const courses = await res.json();
	return new Map(courses) as Map<SameCourseAndProfessorsId, CourseSummary>;
}
