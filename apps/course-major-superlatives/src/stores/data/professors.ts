import { getProfessorOptions } from "app/static/professors";
import type { Professor } from "src/types/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfessorsStore = defineStore("professors", () => {
	const professors = ref<Professor[]>([]);

	return {
		professors,
		fetchProfessors: async () => {
			try {
				const professorsMap = await getProfessorOptions();
				professors.value = Array.from(professorsMap.values());
			} catch (error) {
				console.error("Error fetching catalog:", error);
				throw error;
			}
		},
	};
});
