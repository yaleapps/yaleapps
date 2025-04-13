<script setup lang="ts">
import type { CourseSummary } from "app/static/generate-map-of-professors-and-courses-from-season-codes/schema";
import Fuse from "fuse.js";
import type { QSelectProps } from "quasar";
import { useCoursesStore } from "src/stores/data/courses";
import { useFormStore } from "src/stores/form";
import { getDisplayText } from "src/utils/getDisplayText";
import { ref, watch } from "vue";

const props = defineProps<{
	keyOfFavoritesStore: keyof ReturnType<typeof useFormStore>;
	label: string;
}>();

const formStore = useFormStore();
const coursesStore = useCoursesStore();
const displayedCourseOptions = ref<CourseSummary[]>([]);

watch(
	() => coursesStore.courses,
	(newCourses) => {
		displayedCourseOptions.value = newCourses;
	},
	{ immediate: true },
);

const filterFn: QSelectProps["onFilter"] = (val, update) => {
	const fuse = new Fuse(coursesStore.courses, {
		keys: ["course_codes", "title"] satisfies (keyof CourseSummary)[],
		threshold: 0.4,
	});

	if (val === "") {
		update(() => {
			displayedCourseOptions.value = coursesStore.courses;
		});
		return;
	}

	update(
		() => {
			const needle = val.toLowerCase();
			displayedCourseOptions.value = fuse.search(needle).map(result => result.item);
		},
		(ref) => {
			ref.setOptionIndex(-1);
			ref.moveOptionSelection(1, true);
		},
	);
};

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
</script>

<template>
	<q-select v-model="formStore[props.keyOfFavoritesStore]" :label="props.label" :options="displayedCourseOptions"
		option-value="course_id" :option-label="getDisplayText" multiple use-input use-chips filled menu-self="top middle"
		menu-anchor="bottom middle" @filter="filterFn">
		<template #option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section avatar>
					<q-icon :name="getQuasarIcon(scope.opt)" />
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ scope.opt.title }}</q-item-label>
					<q-item-label caption>
						{{ scope.opt.course_codes.join(', ') }}
					</q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>
