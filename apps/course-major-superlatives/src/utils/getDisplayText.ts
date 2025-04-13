import type { CourseSummary } from "src/types/types";

export function getDisplayText(course: CourseSummary) {
	return `${course.course_codes.join(" | ")} | ${course.title}`;
}
