import type { CourseSummary } from "../src/types/types";

const year = new Date().getFullYear();

export async function saveCourseOptions(courseOptions: CourseSummary[]) {
	const { promises: fs } = await import("node:fs");
	await fs.writeFile(
		`apps/course-major-superlatives/static/${year}-course-options.json`,
		JSON.stringify(courseOptions),
	);
}

export async function getCourseOptions(): Promise<CourseSummary[]> {
	const res = await fetch(
		`https://raw.githubusercontent.com/yaleapps/yaleapps/refs/heads/main/apps/course-major-superlatives/static/${year}-course-options.json`,
	);
	const courseOptions = await res.json();
	return courseOptions as CourseSummary[];
}
