import type { Professor } from "../src/types/types";

const year = new Date().getFullYear();

export async function saveProfessorOptions(
	professorsOptions: Professor[],
): Promise<void> {
	const { promises: fs } = await import("node:fs");
	await fs.writeFile(
		`apps/course-major-superlatives/static/${year}-professor-options.json`,
		JSON.stringify(professorsOptions),
	);
}

export async function getProfessorOptions(): Promise<Professor[]> {
	const res = await fetch(
		`https://raw.githubusercontent.com/yaleapps/yaleapps/refs/heads/main/apps/course-major-superlatives/static/${year}-professor-options.json`,
	);
	const professors = await res.json();
	return professors as Professor[];
}
