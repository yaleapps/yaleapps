import type { CourseSummary } from "app/static/generate-map-of-professors-and-courses-from-season-codes";

export function getDisplayText(course: CourseSummary) {
	return `${course.course_codes.join(" | ")} | ${course.title}`;
}
