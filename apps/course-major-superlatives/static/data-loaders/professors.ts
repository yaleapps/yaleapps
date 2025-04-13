import type { Professor } from "../../src/types/types";

export async function saveProfessorsMap(
	professorsMap: Map<number, Professor>,
): Promise<void> {
	const { promises: fs } = await import("node:fs");
	const professors = Array.from(professorsMap.entries());
	await fs.writeFile(
		"apps/course-major-superlatives/static/professors.json",
		JSON.stringify(professors),
	);
}

export async function getProfessorsMap(): Promise<Map<number, Professor>> {
	const res = await fetch(
		"https://raw.githubusercontent.com/yaleapps/yaleapps/refs/heads/main/apps/course-major-superlatives/static/professors.json",
	);
	const professors = await res.json();
	return new Map(professors) as Map<number, Professor>;
}
