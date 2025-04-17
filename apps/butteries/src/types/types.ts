import { type } from "arktype";

export type CourseSummary = {
	course_id: CourseId;
	same_course_id: SameCourseId;
	same_course_and_profs_id: SameCourseAndProfessorsId;
	course_codes: string[];
	title: string;
	description: string;
	course_professors: Professor[];
};

const CourseId = type("number#CourseId");
const SameCourseId = type("number#SameCourseId");
const SameCourseAndProfessorsId = type("number#SameCourseAndProfessorsId");

export type CourseId = typeof CourseId.infer;
export type SameCourseId = typeof SameCourseId.infer;
export type SameCourseAndProfessorsId = typeof SameCourseAndProfessorsId.infer;

const Professor = type({
	professor_id: "number",
	name: "string",
});

export const CourseFromCourseTableApi = type({
	areas: "('Hu' | 'So' | 'Sc')[]",
	colsem: "boolean",
	course_id: CourseId,
	course_professors: type({
		professor: Professor,
	}).array(),
	credits: "number",
	description: "string",
	extra_info:
		"'ACTIVE' | 'CANCELLED' | 'CLOSED' | 'MOVED_TO_FALL_TERM' | 'MOVED_TO_SPRING_TERM' | 'NUMBER_CHANGED'",
	final_exam: "string | null",
	fysem: "boolean",
	last_offered_course_id: "number | null",
	listings: type({
		course_code: "string",
		crn: "number",
		number: "string",
		school: "string",
		subject: "string",
	}).array(),
	primary_crn: "number | null",
	requirements: "string",
	same_course_and_profs_id: SameCourseAndProfessorsId,
	same_course_id: SameCourseId,
	season_code: "string",
	section: "string",
	skills: "('WR' | 'QR' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5')[]",
	title: "string",
	time_added: "string | null",
	last_updated: "string | null",
});

export type CourseFromCourseTableApi = typeof CourseFromCourseTableApi.infer;
export type Professor = typeof Professor.infer;
