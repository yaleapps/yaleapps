import type { CourseSummary } from "src/types/types";
import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { computed, ref } from "vue";
import type { ResidentialCollege } from "@repo/constants";

export const use2025FormStore = defineStore("2025-form", () => {
	const email = ref("");
	const classYear = ref<"2024" | "2025" | "2026" | "2027" | "2028" | null>(
		null,
	);
	const residentialCollege = ref<ResidentialCollege | null>(null);
	const major = ref<string[]>([]);
	const selectedFavoriteProfessors = ref<string[]>([]);
	const selectedFavoriteCourses = ref<CourseSummary[]>([]);
	const selectedGuttiestCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteMajorCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteWritingCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteScienceCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteQRCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteHumanitiesCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteSocialScienceCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteLectureCourses = ref<CourseSummary[]>([]);
	const selectedFavoriteSeminarCourses = ref<CourseSummary[]>([]);
	const selectedQuintessentiallyYaleCourse = ref<CourseSummary[]>([]);
	const majorSatisfactionOutOf10 = ref<number>(5);
	const remarks = ref("");

	return {
		email,
		classYear,
		residentialCollege,
		major,
		selectedFavoriteProfessors,
		selectedFavoriteCourses,
		selectedGuttiestCourses,
		selectedFavoriteMajorCourses,
		selectedFavoriteWritingCourses,
		selectedFavoriteScienceCourses,
		selectedFavoriteQRCourses,
		selectedFavoriteHumanitiesCourses,
		selectedFavoriteSocialScienceCourses,
		selectedFavoriteLectureCourses,
		selectedFavoriteSeminarCourses,
		selectedQuintessentiallyYaleCourse,
		majorSatisfactionOutOf10,
		remarks,
		isFormValid: computed(() => {
			return (
				email.value &&
				classYear.value &&
				residentialCollege.value &&
				major.value.length > 0 &&
				selectedFavoriteProfessors.value.length > 0 &&
				selectedFavoriteCourses.value.length > 0 &&
				selectedGuttiestCourses.value.length > 0 &&
				selectedFavoriteMajorCourses.value.length > 0 &&
				selectedQuintessentiallyYaleCourse.value.length > 0
			);
		}),
		submitForm: async () => {
			try {
				const { error } = await supabase.from("UserCourse").insert({
					email: email.value,
					class_year: classYear.value,
					residential_college: residentialCollege.value,
					major: major.value,
					selected_favorite_professors: selectedFavoriteProfessors.value,
					selected_favorite_courses: selectedFavoriteCourses.value,
					selected_guttiest_courses: selectedGuttiestCourses.value,
					selected_favorite_major_courses: selectedFavoriteMajorCourses.value,
					selected_favorite_writing_courses:
						selectedFavoriteWritingCourses.value,
					selected_favorite_science_courses:
						selectedFavoriteScienceCourses.value,
					selected_favorite_qr_courses: selectedFavoriteQRCourses.value,
					selected_favorite_humanities_courses:
						selectedFavoriteHumanitiesCourses.value,
					selected_favorite_social_science_courses:
						selectedFavoriteSocialScienceCourses.value,
					selected_favorite_lecture_courses:
						selectedFavoriteLectureCourses.value,
					selected_favorite_seminar_courses:
						selectedFavoriteSeminarCourses.value,
					selected_quintessentially_yale_course:
						selectedQuintessentiallyYaleCourse.value,
					major_satisfaction: majorSatisfactionOutOf10.value,
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
			classYear.value = "2025";
			residentialCollege.value = null;
			major.value = [];
			selectedFavoriteProfessors.value = [];
			selectedFavoriteCourses.value = [];
			selectedGuttiestCourses.value = [];
			selectedFavoriteMajorCourses.value = [];
			selectedFavoriteWritingCourses.value = [];
			selectedFavoriteScienceCourses.value = [];
			selectedFavoriteQRCourses.value = [];
			selectedFavoriteHumanitiesCourses.value = [];
			selectedFavoriteSocialScienceCourses.value = [];
			selectedFavoriteLectureCourses.value = [];
			selectedFavoriteSeminarCourses.value = [];
			selectedQuintessentiallyYaleCourse.value = [];
			majorSatisfactionOutOf10.value = 5;
			remarks.value = "";
		},
	};
});
