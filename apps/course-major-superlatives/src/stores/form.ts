import * as coursesMapPersister from "app/static/generate-map-of-professors-and-courses-from-season-codes/map-persisters/courses";
import type { CourseSummary } from "app/static/generate-map-of-professors-and-courses-from-season-codes/schema";
import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { computed, ref } from "vue";

export const useFormStore = defineStore("favorites", () => {
	const email = ref("");
	const major = ref<string[]>([]);
	const selectedFavoriteProfessors = ref<string[]>([]);
	const selectedFavoriteCourses = ref<CourseSummary[]>([]);
	const selectedGuttiestCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteMajorCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteDistributionalCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteLectureCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteSeminarCourses = ref<CourseSummary[]>([]);
	const remarks = ref("");
	const courses = ref<CourseSummary[]>([]);

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
		courses,
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
		fetchAbbreviatedCatalog: async () => {
			try {
				const coursesMap = await coursesMapPersister.get();
				const courseSummaries = Array.from(coursesMap.values());
				courses.value = courseSummaries;
			} catch (error) {
				console.error("Error fetching catalog:", error);
				throw error;
			}
		},
		submitForm: async () => {
			try {
				const { error } = await supabase.from("UserCourse").insert({
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
});
