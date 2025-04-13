<script lang="ts" setup>
import { MAJORS } from "@repo/constants";
import { useFormStore } from "src/stores/form";
import { computed, ref } from "vue";

const formStore = useFormStore();
const query = ref('');

const filteredMajors = computed(() => {
	if (query.value === '') return MAJORS;
	return MAJORS.filter(
		(major) => major.toLowerCase().includes(query.value.toLowerCase())
	);
});
</script>

<template>
	<q-select v-model="formStore.major" label="Major(s)" :options="filteredMajors" multiple use-input use-chips filled
		menu-self="top middle" menu-anchor="bottom middle" @filter="(val, update) => {
			update(
				() => query = val,
				(ref) => {
					ref.setOptionIndex(-1);
					ref.moveOptionSelection(1, true);
				}
			);
		}" />
</template>
