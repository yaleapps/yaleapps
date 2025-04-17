import type { CourseSummary, Professor } from "src/types/types";
import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { ref, watch } from "vue";
import type { Major, ResidentialCollegeName } from "@repo/constants";
import type { FavoriteMajorCourses, MajorSatisfaction } from "app/database.types";

export const use2025FormStore = defineStore(
	"2025-form",
	() => {
		// Section 1: Your Yale Identity
		const email = ref("");
		const classYear = ref<"2024" | "2025" | "2026" | "2027" | "2028" | null>(
			null,
		);
		const residentialCollege = ref<ResidentialCollegeName | null>(null);

		// Section 2: The Hall of Fame
		const selectedFavoriteProfessors = ref<Professor[]>([]);
		const selectedFavoriteCourses = ref<CourseSummary[]>([]);
		const selectedGuttiestCourses = ref<CourseSummary[]>([]);
		const remarks = ref("");

		// Section 3: Academic Superlatives
		const selectedQuintessentiallyYaleCourse = ref<CourseSummary[]>([]);
		const selectedRegrettedCourses = ref<CourseSummary[]>([]);
		const selectedFavoriteDistributionalCourses = ref<CourseSummary[]>([]);
		const major = ref<Major[]>([]);
		const selectedFavoriteMajorCourses = ref<FavoriteMajorCourses>({});
		const selectedMajorSatisfaction = ref<MajorSatisfaction>({});

		// Initialize empty arrays and default satisfaction for each major when major changes
		watch(major, (newMajors) => {
			const newCoursesMap = {
				...selectedFavoriteMajorCourses.value,
			};
			const newSatisfactionMap = {
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
			// Section 1: Your Yale Identity
			email,
			classYear,
			residentialCollege,

			// Section 2: The Hall of Fame
			selectedFavoriteProfessors,
			selectedFavoriteCourses,
			selectedGuttiestCourses,
			remarks,

			// Section 3: Academic Superlatives
			selectedQuintessentiallyYaleCourse,
			selectedRegrettedCourses,
			selectedFavoriteDistributionalCourses,
			major,
			selectedFavoriteMajorCourses,
			selectedMajorSatisfaction,

			submitForm: async () => {
				try {
					if (!email.value) {
						throw new Error("Email is required");
					}
					if (!classYear.value) {
						throw new Error("Class year is required");
					}
					if (!residentialCollege.value) {
						throw new Error("Residential college is required");
					}
					const { error } = await supabase.from("superlatives_2025").insert({
						email: email.value.toLowerCase(),
						class_year: classYear.value,
						residential_college: residentialCollege.value as string,

						selected_favorite_professors: selectedFavoriteProfessors.value,
						selected_favorite_courses: selectedFavoriteCourses.value,
						selected_guttiest_courses: selectedGuttiestCourses.value,
						remarks: remarks.value,

						selected_quintessentially_yale_course:
							selectedQuintessentiallyYaleCourse.value,
						selected_regretted_courses: selectedRegrettedCourses.value,
						selected_favorite_distributional_courses:
							selectedFavoriteDistributionalCourses.value,
						major: major.value,
						selected_favorite_major_courses: selectedFavoriteMajorCourses.value,
						selected_major_satisfaction: selectedMajorSatisfaction.value,
					});

					if (error) throw error;
				} catch (error) {
					console.error("Error submitting form:", error);
					throw error;
				}
			},

			resetForm: () => {
				// Section 1: Your Yale Identity
				email.value = "";
				classYear.value = null;
				residentialCollege.value = null;

				// Section 2: The Hall of Fame
				selectedFavoriteProfessors.value = [];
				selectedFavoriteCourses.value = [];
				selectedGuttiestCourses.value = [];
				remarks.value = "";

				// Section 3: Academic Superlatives
				selectedQuintessentiallyYaleCourse.value = [];
				selectedRegrettedCourses.value = [];
				selectedFavoriteDistributionalCourses.value = [];
				major.value = [];
				selectedFavoriteMajorCourses.value = {};
				selectedMajorSatisfaction.value = {};
			},
		};
	},
	{ persist: true },
);
