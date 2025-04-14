import type { CourseSummary, Professor } from "src/types/types";
import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { computed, ref, watch } from "vue";
import type { ResidentialCollege } from "@repo/constants";

export const use2025FormStore = defineStore(
	"2025-form",
	() => {
		// Section 1: Introduction
		const email = ref("");
		const classYear = ref<"2024" | "2025" | "2026" | "2027" | "2028" | null>(
			null,
		);
		const major = ref<string[]>([]);

		// Section 2: Overall Favorites
		const selectedFavoriteProfessors = ref<Professor[]>([]);
		const selectedFavoriteCourses = ref<CourseSummary[]>([]);
		const selectedGuttiestCourses = ref<CourseSummary[]>([]);
		const selectedQuintessentiallyYaleCourse = ref<CourseSummary[]>([]);
		const remarks = ref("");

		// Section 3: Course Categories
		const selectedFavoriteDistributionalCourses = ref<CourseSummary[]>([]);
		const selectedRegrettedCourses = ref<CourseSummary[]>([]);

		// Section 4: Major Reflections
		const selectedFavoriteMajorCourses = ref<Record<string, CourseSummary[]>>(
			{},
		);
		const selectedMajorSatisfaction = ref<Record<string, number>>({});

		// Section 5: Yale Life
		const residentialCollege = ref<ResidentialCollege | null>(null);

		// Initialize empty arrays and default satisfaction for each major when major changes
		watch(major, (newMajors) => {
			const newCoursesMap: Record<string, CourseSummary[]> = {
				...selectedFavoriteMajorCourses.value,
			};
			const newSatisfactionMap: Record<string, number> = {
				...selectedMajorSatisfaction.value,
			};
			for (const m of newMajors) {
				if (!newCoursesMap[m]) {
					newCoursesMap[m] = [];
				}
				if (!newSatisfactionMap[m]) {
					newSatisfactionMap[m] = 5;
				}
			}
			selectedFavoriteMajorCourses.value = newCoursesMap;
			selectedMajorSatisfaction.value = newSatisfactionMap;
		});

		return {
			// Section 1: Introduction
			email,
			classYear,
			major,

			// Section 2: Overall Favorites
			selectedFavoriteProfessors,
			selectedFavoriteCourses,
			selectedGuttiestCourses,
			selectedQuintessentiallyYaleCourse,
			remarks,

			// Section 3: Course Categories
			selectedFavoriteDistributionalCourses,
			selectedRegrettedCourses,

			// Section 4: Major Reflections
			selectedFavoriteMajorCourses,
			selectedMajorSatisfaction,

			// Section 5: Yale Life
			residentialCollege,

			submitForm: async () => {
				try {
					const { error } = await supabase.from("superlatives_2025").insert({
						// Section 1
						email: email.value,
						class_year: classYear.value,
						major: major.value,

						// Section 2: Overall Favorites
						selected_favorite_professors: selectedFavoriteProfessors.value,
						selected_favorite_courses: selectedFavoriteCourses.value,
						selected_guttiest_courses: selectedGuttiestCourses.value,
						selected_quintessentially_yale_course:
							selectedQuintessentiallyYaleCourse.value,
						remarks: remarks.value,

						// Section 3: Category Favorites
						selected_favorite_distributional_courses:
							selectedFavoriteDistributionalCourses.value,
						selected_regretted_courses: selectedRegrettedCourses.value,

						// Section 4: Major Reflections
						selected_favorite_major_courses: selectedFavoriteMajorCourses.value,
						selected_major_satisfaction: selectedMajorSatisfaction.value,
						residential_college: residentialCollege.value,
					});

					if (error) throw error;
				} catch (error) {
					console.error("Error submitting form:", error);
					throw error;
				}
			},

			resetForm: () => {
				// Section 1
				email.value = "";
				classYear.value = null;
				major.value = [];

				// Section 2
				selectedFavoriteProfessors.value = [];
				selectedFavoriteCourses.value = [];
				selectedGuttiestCourses.value = [];
				selectedQuintessentiallyYaleCourse.value = [];
				remarks.value = "";

				// Section 3
				selectedFavoriteDistributionalCourses.value = [];
				selectedRegrettedCourses.value = [];

				// Section 4
				selectedFavoriteMajorCourses.value = {};
				selectedMajorSatisfaction.value = {};

				// Section 5
				residentialCollege.value = null;
			},
		};
	},
	{ persist: true },
);
