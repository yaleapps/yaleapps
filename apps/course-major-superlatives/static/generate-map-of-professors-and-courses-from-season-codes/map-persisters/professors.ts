import { promises as fs } from "node:fs";
import type { Professor } from "../schema";

export async function save(
	professorsMap: Map<number, Professor>,
): Promise<void> {
	const professors = Array.from(professorsMap.entries());
	await fs.writeFile(
		"apps/course-major-superlatives/static/professors.json",
		JSON.stringify(professors),
	);
}

export async function get(): Promise<Map<number, Professor>> {
	const professors = await fs.readFile(
		"https://github.com/yaleapps/yaleapps/blob/main/apps/course-major-superlatives/static/professors.json",
		"utf-8",
	);
	return new Map(JSON.parse(professors)) as Map<number, Professor>;
}
