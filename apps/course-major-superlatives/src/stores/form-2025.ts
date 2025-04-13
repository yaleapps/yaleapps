import type { CourseSummary } from "src/types/types";
import { defineStore } from "pinia";
import { supabase } from "src/supabase";
import { computed, ref, watch } from "vue";
import type { ResidentialCollege } from "@repo/constants";

export const use2025FormStore = defineStore(
	"2025-form",
	() => {
		const email = ref("");
		const classYear = ref<"2024" | "2025" | "2026" | "2027" | "2028" | null>(
			null,
		);
		const residentialCollege = ref<ResidentialCollege | null>(null);
		const major = ref<string[]>([]);
		const selectedFavoriteProfessors = ref<string[]>([]);
		const selectedFavoriteCourses = ref<CourseSummary[]>([]);
		const selectedGuttiestCourses = ref<CourseSummary[]>([]);
		const selectedQuintessentiallyYaleCourse = ref<CourseSummary[]>([]);
		const selectedUnderratedCourses = ref<CourseSummary[]>([]);
		const selectedOverratedCourses = ref<CourseSummary[]>([]);
		const selectedBestLectureCourses = ref<CourseSummary[]>([]);
		const selectedBestSeminarCourses = ref<CourseSummary[]>([]);
		const bedtime = ref<string>("10:00 PM");
		const remarks = ref("");

		// Map of major name to favorite courses and satisfaction for that major
		const selectedFavoriteMajorCoursesMap = ref<
			Record<string, { courses: CourseSummary[]; satisfaction: number }>
		>({});

		// Initialize empty arrays for each major when major changes
		watch(major, (newMajors) => {
			const newMap: Record<
				string,
				{ courses: CourseSummary[]; satisfaction: number }
			> = {
				...selectedFavoriteMajorCoursesMap.value,
			};
			for (const m of newMajors) {
				if (!newMap[m]) {
					newMap[m] = { courses: [], satisfaction: 5 };
				}
			}
			selectedFavoriteMajorCoursesMap.value = newMap;
		});

		return {
			email,
			classYear,
			residentialCollege,
			major,
			selectedFavoriteProfessors,
			selectedFavoriteCourses,
			selectedGuttiestCourses,
			selectedQuintessentiallyYaleCourse,
			selectedUnderratedCourses,
			selectedOverratedCourses,
			selectedBestLectureCourses,
			selectedBestSeminarCourses,
			selectedFavoriteMajorCoursesMap,
			bedtime,
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
					selectedQuintessentiallyYaleCourse.value.length > 0 &&
					// Check if we have favorite courses for each major
					major.value.every(
						(m) =>
							(selectedFavoriteMajorCoursesMap.value[m]?.courses || []).length >
							0,
					)
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
						selected_quintessentially_yale_course:
							selectedQuintessentiallyYaleCourse.value,
						selected_underrated_courses: selectedUnderratedCourses.value,
						selected_overrated_courses: selectedOverratedCourses.value,
						selected_best_lecture_courses: selectedBestLectureCourses.value,
						selected_best_seminar_courses: selectedBestSeminarCourses.value,
						selected_favorite_major_courses_map:
							selectedFavoriteMajorCoursesMap.value,
						bedtime: bedtime.value,
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
				selectedQuintessentiallyYaleCourse.value = [];
				selectedUnderratedCourses.value = [];
				selectedOverratedCourses.value = [];
				selectedBestLectureCourses.value = [];
				selectedBestSeminarCourses.value = [];
				selectedFavoriteMajorCoursesMap.value = {};
				bedtime.value = "10:00 PM";
				remarks.value = "";
			},
		};
	},
	{ persist: true },
);
