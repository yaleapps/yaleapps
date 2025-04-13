import { promises as fs } from "node:fs";
import type { CourseSummary, SameCourseAndProfessorsId } from "../schema";

export async function save(
	coursesMap: Map<SameCourseAndProfessorsId, CourseSummary>,
) {
	const courses = Array.from(coursesMap.entries());
	await fs.writeFile(
		"apps/course-major-superlatives/static/courses.json",
		JSON.stringify(courses),
	);
}

export async function get() {
	const courses = await fs.readFile(
		"https://github.com/yaleapps/yaleapps/blob/main/apps/course-major-superlatives/static/professors.json",
		"utf-8",
	);
	return new Map(JSON.parse(courses)) as Map<
		SameCourseAndProfessorsId,
		CourseSummary
	>;
}
