<script lang="ts" setup>
import { MAJORS } from "@repo/constants";
import { computed, ref } from "vue";

const modelValue = defineModel<string[]>({ required: true });
const query = ref('');

const filteredMajors = computed(() => {
	if (query.value === '') return MAJORS;
	return MAJORS.filter(
		(major) => major.toLowerCase().includes(query.value.toLowerCase())
	);
});
</script>

<template>
	<q-select v-model="modelValue" label="Major(s)" :options="filteredMajors" multiple use-input use-chips filled
		menu-self="top middle" menu-anchor="bottom middle" @filter="(val, update) => {
			update(
				() => query = val,
				(ref) => {
					ref.setOptionIndex(-1);
					ref.moveOptionSelection(1, true);
				}
			);
		}" input-debounce="0" />
</template>
