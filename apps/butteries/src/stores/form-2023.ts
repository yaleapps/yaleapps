import type { CourseSummary, Professor } from "src/types/types";
import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { computed, ref } from "vue";

export const use2023FormStore = defineStore(
	"2023-form",
	() => {
		const email = ref("");
		const major = ref<string[]>([]);
		const selectedFavoriteProfessors = ref<Professor[]>([]);
		const selectedFavoriteCourses = ref<CourseSummary[]>([]);
		const selectedGuttiestCourses = ref<CourseSummary[]>([]);
		const selectedFavoriteMajorCourses = ref<CourseSummary[]>([]);
		const selectedFavoriteDistributionalCourses = ref<CourseSummary[]>([]);
		const selectedFavoriteLectureCourses = ref<CourseSummary[]>([]);
		const selectedFavoriteSeminarCourses = ref<CourseSummary[]>([]);
		const remarks = ref("");

		return {
			email,
			major,
			selectedFavoriteProfessors,
			selectedFavoriteCourses,
			selectedGuttiestCourses,
			selectedFavoriteMajorCourses,
			selectedFavoriteDistributionalCourses,
			selectedFavoriteLectureCourses,
			selectedFavoriteSeminarCourses,
			remarks,
			isFormValid: computed(() => {
				return (
					email.value &&
					major.value.length > 0 &&
					selectedFavoriteProfessors.value.length > 0 &&
					selectedFavoriteCourses.value.length > 0 &&
					selectedGuttiestCourses.value.length > 0 &&
					selectedFavoriteMajorCourses.value.length > 0 &&
					selectedFavoriteDistributionalCourses.value.length > 0
				);
			}),
			submitForm: async () => {
				try {
					const { error } = await supabase.from("superlatives_2023").insert({
						email: email.value,
						major: major.value,
						selected_favorite_professors: selectedFavoriteProfessors.value,
						selected_favorite_courses: selectedFavoriteCourses.value,
						selected_guttiest_courses: selectedGuttiestCourses.value,
						selected_favorite_major_courses: selectedFavoriteMajorCourses.value,
						selected_favorite_distributional_courses:
							selectedFavoriteDistributionalCourses.value,
						selected_favorite_lecture_courses:
							selectedFavoriteLectureCourses.value,
						selected_favorite_seminar_courses:
							selectedFavoriteSeminarCourses.value,
						remarks: remarks.value,
					});

					if (error) throw error;
				} catch (error) {
					console.error("Error submitting form:", error);
					throw error;
				}
			},
			resetForm: () => {
				email.value = "";
				major.value = [];
				selectedFavoriteProfessors.value = [];
				selectedFavoriteCourses.value = [];
				selectedGuttiestCourses.value = [];
				selectedFavoriteMajorCourses.value = [];
				selectedFavoriteDistributionalCourses.value = [];
				selectedFavoriteLectureCourses.value = [];
				selectedFavoriteSeminarCourses.value = [];
				remarks.value = "";
			},
		};
	},
	{ persist: true },
);
