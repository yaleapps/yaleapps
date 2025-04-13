import type { CourseFromSupabase } from "src/types/courseFromSupabase";

import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { computed, ref } from "vue";

export type CourseAbbreviated = Pick<
	CourseFromSupabase,
	"same_course_id" | "all_course_codes" | "title"
>;

const selectedColumns: (keyof CourseAbbreviated)[] = [
	"same_course_id",
	"all_course_codes",
	"title",
];

export const useFormStore = defineStore("favorites", () => {
	const email = ref("");
	const major = ref<string[]>([]);
	const selectedFavoriteProfessors = ref<string[]>([]);
	const selectedFavoriteCourses = ref<CourseAbbreviated[]>([]);
	const selectedGuttiestCourses = ref<CourseAbbreviated[]>([]);
	const selectedFavoriteMajorCourses = ref<CourseAbbreviated[]>([]);
	const selectedFavoriteDistributionalCourses = ref<CourseAbbreviated[]>([]);
	const selectedFavoriteLectureCourses = ref<CourseAbbreviated[]>([]);
	const selectedFavoriteSeminarCourses = ref<CourseAbbreviated[]>([]);
	const remarks = ref("");
	const courses = ref<CourseAbbreviated[]>([]);

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
			// const { data, error } = await supabase
			//   .from('Courses')
			//   .select(selectedColumns.join(','))
			//   .gt('season_code', '202003');
			// Fetch json from 'https://qgwabimelbyerzbvkngr.supabase.co/storage/v1/object/public/json_views/CoursesDisplayDropdown.json'
			try {
				const response = await fetch(
					"https://qgwabimelbyerzbvkngr.supabase.co/storage/v1/object/public/json_views/CoursesDisplayDropdown.json",
				);
				const data = await response.json();
				courses.value = data;
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
