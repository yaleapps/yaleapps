import { getCourseOptions } from "app/static/courses";
import type { CourseSummary } from "src/types/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCoursesStore = defineStore("courses", () => {
	const courses = ref<CourseSummary[]>([]);

	return {
		courses,
		fetchAbbreviatedCatalog: async () => {
			try {
				const coursesMap = await getCourseOptions();
				const courseSummaries = Array.from(coursesMap.values());
				courses.value = courseSummaries;
			} catch (error) {
				console.error("Error fetching catalog:", error);
				throw error;
			}
		},
	};
});
