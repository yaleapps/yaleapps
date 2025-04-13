import { getProfessorsMap } from "app/static/generate-map-of-professors-and-courses-from-season-codes/map-persisters/professors";
import type { Professor } from "app/static/generate-map-of-professors-and-courses-from-season-codes/schema";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfessorsStore = defineStore("professors", () => {
	const professors = ref<Professor[]>([]);

	return {
		professors,
		fetchProfessors: async () => {
			try {
				const professorsMap = await getProfessorsMap();
				professors.value = Array.from(professorsMap.values());
			} catch (error) {
				console.error("Error fetching catalog:", error);
				throw error;
			}
		},
	};
});
