<script lang="ts" setup>
import type { QSelectProps } from "quasar";
import { MAJORS } from "@repo/constants";
import { useFormStore } from "src/stores/form";
import { ref } from "vue";

const formStore = useFormStore();
const options = ref([...MAJORS]);

const filterFn: QSelectProps["onFilter"] = (val, update) => {
	update(
		() => {
			options.value = MAJORS.filter((i) => {
				return i.toLowerCase().includes(val.toLowerCase());
			});
		},
		(ref) => {
			ref.setOptionIndex(-1);
			ref.moveOptionSelection(1, true);
		},
	);
};
</script>

<template>
	<q-select v-model="formStore.major" label="Major(s)" :options="options" multiple use-input use-chips filled
		menu-self="top middle" menu-anchor="bottom middle" @filter="filterFn" />
</template>
