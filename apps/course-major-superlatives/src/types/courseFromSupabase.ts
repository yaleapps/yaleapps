import type { Database } from "app/types/supabase";

import type { Area, Skill } from "./courseFromApi";

type Row = Database["public"]["Tables"]["Courses"]["Row"];
export type CourseFromSupabase = {
	all_course_codes: string[];
	areas: Area[];
	skills: Skill[];
} & Row;
