import { useQuery } from "@tanstack/vue-query";
import { supabase } from "src/supabase";
import type {
	CourseSummary,
	Professor,
	SameCourseAndProfessorsId,
} from "src/types/types";
import { computed } from "vue";

export type AggregatedCourseData = CourseSummary & { count: number };

export type AggregatedProfessorData = Professor & { count: number };

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
		const courseMap = new Map<
			SameCourseAndProfessorsId,
			AggregatedCourseData
		>();

		for (const course of courses.flat()) {
			const existing = courseMap.get(course.same_course_and_profs_id);

			if (existing) {
				existing.count++;
			} else {
				courseMap.set(course.same_course_and_profs_id, {
					...course,
					count: 1,
				});
			}
		}

		return Array.from(courseMap.values());
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
					...prof,
					count: 1,
				});
			}
		}

		return Array.from(profMap.values());
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
