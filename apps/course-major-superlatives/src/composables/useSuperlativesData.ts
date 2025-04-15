import { useQuery } from "@tanstack/vue-query";
import { supabase } from "src/supabase";
import type { CourseSummary, Professor } from "src/types/types";
import { computed } from "vue";

type AggregatedCourseData = {
	courseName: string;
	courseCode: string;
	count: number;
};

type AggregatedProfessorData = {
	name: string;
	professorId: number;
	count: number;
};

export function useSuperlativesData() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["superlatives2025"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("superlatives_2025")
				.select("*");

			if (error) throw error;
			return data;
		},
	});

	function aggregateCourses(
		courses: CourseSummary[][],
	): AggregatedCourseData[] {
		const courseMap = new Map<string, AggregatedCourseData>();

		for (const course of courses.flat()) {
			const key = `${course.course_codes.join(" | ")}-${course.title}`;
			const existing = courseMap.get(key);

			if (existing) {
				existing.count++;
			} else {
				courseMap.set(key, {
					courseName: course.title,
					courseCode: course.course_codes.join(" | "),
					count: 1,
				});
			}
		}

		return Array.from(courseMap.values())
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);
	}

	function aggregateProfessors(
		professors: Professor[][],
	): AggregatedProfessorData[] {
		const profMap = new Map<string, AggregatedProfessorData>();

		for (const prof of professors.flat()) {
			const key = `${prof.name}-${prof.professor_id}`;
			const existing = profMap.get(key);

			if (existing) {
				existing.count++;
			} else {
				profMap.set(key, {
					name: prof.name,
					professorId: prof.professor_id,
					count: 1,
				});
			}
		}

		return Array.from(profMap.values())
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);
	}

	const transformedData = computed(() => {
		if (!data.value) return null;

		return {
			favoriteCourses: aggregateCourses(
				data.value.map((d) => d.selected_favorite_courses),
			),
			favoriteProfessors: aggregateProfessors(
				data.value.map((d) => d.selected_favorite_professors),
			),
			distributionalCourses: aggregateCourses(
				data.value.map((d) => d.selected_favorite_distributional_courses),
			),
			guttiestCourses: aggregateCourses(
				data.value.map((d) => d.selected_guttiest_courses),
			),
			regrettedCourses: aggregateCourses(
				data.value.map((d) => d.selected_regretted_courses),
			),
			quintessentialCourses: aggregateCourses(
				data.value.map((d) => d.selected_quintessentially_yale_course),
			),
		};
	});

	return {
		data: transformedData,
		isLoading,
		error,
	};
}
