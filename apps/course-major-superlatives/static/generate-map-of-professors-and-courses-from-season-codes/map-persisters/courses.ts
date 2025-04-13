import type { CourseSummary, SameCourseAndProfessorsId } from "../schema";

export async function saveCoursesMap(
	coursesMap: Map<SameCourseAndProfessorsId, CourseSummary>,
) {
	const { promises: fs } = await import("node:fs");
	const courses = Array.from(coursesMap.entries());
	await fs.writeFile(
		"apps/course-major-superlatives/static/courses.json",
		JSON.stringify(courses),
	);
}

export async function getCoursesMap() {
	const res = await fetch(
		"https://github.com/yaleapps/yaleapps/blob/main/apps/course-major-superlatives/static/professors.json",
	);
	const courses = await res.json();
	return new Map(courses) as Map<SameCourseAndProfessorsId, CourseSummary>;
}
