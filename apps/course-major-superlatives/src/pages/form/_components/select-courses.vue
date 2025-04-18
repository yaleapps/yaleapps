<script setup lang="ts">
import Fuse from "fuse.js";
import { useCoursesStore } from "src/stores/data/courses";
import type { CourseSummary } from "src/types/types";
import { computed, ref } from "vue";

const modelValue = defineModel<CourseSummary[]>({ required: true });
defineProps<{ label: string; }>();

const coursesStore = useCoursesStore();
const query = ref('');

// Create Fuse instance once and reuse it
const fuse = computed(() => new Fuse(coursesStore.courses, {
	keys: ["course_codes", "title", "course_professors.name"] satisfies (keyof CourseSummary | `${(keyof CourseSummary)}.${string}`)[],
	threshold: 0.4,
}));

const filteredCourses = computed(() => {
	if (query.value === '') return coursesStore.courses;
	return fuse.value.search(query.value).map(result => result.item);
});

function getQuasarIcon(course: CourseSummary) {
	const quasarIcons = {
		auto_stories: ["lit", "lang", "read", "writ", "novel", "poet", "engl", "phil", "hist"],
		movie: ["film", "cinema", "movie", "theater", "theatre", "drama"],
		computer: ["cpsc", "comp", "program", "code", "algo", "software"],
		telescope: ["astronomy", "space", "cosmos", "galaxy", "star", "planet"],
		biotech: ["biology", "microbiology", "cells", "organisms", "genetics"],
		psychology: ["neuro", "psyc", "cog", "mind", "intelligence"],
		science: ["chem", "molec", "at", "sc", "element", "phy", "research", "bio"],
		headphones: ["mus", "sound", "audio"],
		health_and_safety: ["phys", "fit", "gym", "health", "exercise", "athletic", "sport"],
		account_balance: ["econ", "finance", "money", "invest", "bus", "account", "bank"],
		gavel: ["law", "legal", "crim", "const", "court", "justice", "rights"],
		public: ["geo", "cult", "anthro", "soci", "global", "intl", "relig", "glbl"],
	};

	for (const [icon, keywords] of Object.entries(quasarIcons)) {
		for (const keyword of keywords) {
			if (
				course.title?.toLowerCase().includes(keyword)
				|| course.course_codes.some(code => code.toLowerCase().includes(keyword))
			) {
				return icon;
			}
		}
	}
	return "school";
}


function getDisplayText(course: CourseSummary) {
	return `${course.course_codes.join(" | ")} | ${course.title}`;
}
</script>

<template>
	<q-select v-model="modelValue" :label="label" :options="filteredCourses" option-value="course_id"
		:option-label="getDisplayText" multiple use-input use-chips filled menu-self="top middle"
		menu-anchor="bottom middle" @filter="(q, update) => {
			update(
				() => query = q,
				(ref) => {
					ref.setOptionIndex(-1);
					ref.moveOptionSelection(1, true);
				}
			);
		}" input-debounce="0">
		<template #option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section avatar>
					<q-icon :name="getQuasarIcon(scope.opt)" />
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ (scope.opt as CourseSummary).title }}</q-item-label>
					<q-item-label caption>
						{{(scope.opt as CourseSummary).course_professors.map((p) => p.name).join(', ')}} |
						{{ (scope.opt as CourseSummary).course_codes.join(', ') }}
					</q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>
