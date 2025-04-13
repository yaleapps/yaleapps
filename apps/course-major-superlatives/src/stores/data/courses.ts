import { getCoursesMap } from "app/static/generate-map-of-professors-and-courses-from-season-codes/map-persisters/courses";
import type { CourseSummary } from "app/static/generate-map-of-professors-and-courses-from-season-codes/schema";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCoursesStore = defineStore("courses", () => {
	const courses = ref<CourseSummary[]>([]);

	return {
		courses,
		fetchAbbreviatedCatalog: async () => {
			try {
				const coursesMap = await getCoursesMap();
				const courseSummaries = Array.from(coursesMap.values());
				courses.value = courseSummaries;
			} catch (error) {
				console.error("Error fetching catalog:", error);
				throw error;
			}
		},
	};
});
