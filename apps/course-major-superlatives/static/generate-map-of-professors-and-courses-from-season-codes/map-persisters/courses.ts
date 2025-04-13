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
		"https://raw.githubusercontent.com/yaleapps/yaleapps/refs/heads/main/apps/course-major-superlatives/static/courses.json",
	);
	const courses = await res.json();
	return new Map(courses) as Map<SameCourseAndProfessorsId, CourseSummary>;
}
