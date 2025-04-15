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

interface MajorStats {
	major: string;
	average: number;
	count: number;
	ratings: number[];
	totalRatings: number;
}

export function useSuperlativesChartData() {
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

	function aggregateCourses<TKey extends CourseSummary[keyof CourseSummary]>({
		courses,
		getAggregationKey,
	}: {
		courses: CourseSummary[][];
		/** Function that returns a unique identifier for the course to aggregate by */
		getAggregationKey: (course: CourseSummary) => TKey;
	}): AggregatedCourseData[] {
		const courseMap = new Map<TKey, AggregatedCourseData>();

		for (const course of courses.flat()) {
			const key = getAggregationKey(course);
			const existing = courseMap.get(key);

			if (existing) {
				existing.count++;
			} else {
				courseMap.set(key, {
					...course,
					count: 1,
				});
			}
		}

		return Array.from(courseMap.values()).sort((a, b) => b.count - a.count);
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

		return Array.from(profMap.values()).sort((a, b) => b.count - a.count);
	}

	function aggregateMajorStats(): MajorStats[] {
		if (!data.value) return [];

		const stats = new Map<
			string,
			{ total: number; count: number; ratings: number[] }
		>();

		// First, initialize stats for all majors that students are in
		for (const submission of data.value) {
			for (const majorName of submission.major) {
				if (!stats.has(majorName)) {
					stats.set(majorName, {
						total: 0,
						count: 0,
						ratings: Array(10).fill(0),
					});
				}
			}
		}

		// Then process satisfaction ratings
		for (const submission of data.value) {
			// Count major popularity first
			for (const majorName of submission.major) {
				const majorStat = stats.get(majorName);
				if (majorStat) {
					majorStat.count++;
				}
			}

			// Process satisfaction ratings
			const satisfactionData = submission.selected_major_satisfaction;
			if (!satisfactionData) continue;

			for (const [major, rating] of Object.entries(satisfactionData)) {
				if (!rating || typeof rating !== "number" || rating < 1 || rating > 10)
					continue;

				// Create stats entry if this is a new major
				if (!stats.has(major)) {
					stats.set(major, { total: 0, count: 0, ratings: Array(10).fill(0) });
				}

				const majorStat = stats.get(major);
				if (majorStat) {
					majorStat.total += rating;
					majorStat.ratings[rating - 1]++;
				}
			}
		}

		// Convert to array and sort by average satisfaction
		return Array.from(stats.entries())
			.map(([major, data]) => {
				const totalRatings = data.ratings.reduce((a, b) => a + b, 0);
				return {
					major,
					average: totalRatings > 0 ? data.total / totalRatings : 0,
					count: data.count,
					ratings: data.ratings,
					totalRatings,
				};
			})
			.filter((stat) => stat.totalRatings > 0)
			.sort((a, b) => b.average - a.average);
	}

	const transformedData = computed(() => {
		if (!data.value) return null;

		return {
			favoriteCourses: aggregateCourses({
				courses: data.value.map((d) => d.selected_favorite_courses),
				getAggregationKey: (course) => course.same_course_and_profs_id,
			}),
			favoriteProfessors: aggregateProfessors(
				data.value.map((d) => d.selected_favorite_professors),
			),
			distributionalCourses: aggregateCourses({
				courses: data.value.map(
					(d) => d.selected_favorite_distributional_courses,
				),
				getAggregationKey: (course) => course.same_course_and_profs_id,
			}),
			guttiestCourses: aggregateCourses({
				courses: data.value.map((d) => d.selected_guttiest_courses),
				getAggregationKey: (course) => course.same_course_and_profs_id,
			}),
			regrettedCourses: aggregateCourses({
				courses: data.value.map((d) => d.selected_regretted_courses),
				getAggregationKey: (course) => course.same_course_and_profs_id,
			}),
			quintessentialCourses: aggregateCourses({
				courses: data.value.map((d) => d.selected_quintessentially_yale_course),
				getAggregationKey: (course) => course.same_course_and_profs_id,
			}),
			majorStats: aggregateMajorStats(),
		};
	});

	return {
		data: transformedData,
		isLoading,
		error,
	};
}
