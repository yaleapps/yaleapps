<script lang="ts" setup>
import { RESIDENTIAL_COLLEGE_NAMES, type ResidentialCollege } from "@repo/constants";
import { computed, ref } from "vue";

const modelValue = defineModel<ResidentialCollege | null>({ required: true });
const query = ref('');

const filteredColleges = computed(() => {
  if (query.value === '') return RESIDENTIAL_COLLEGE_NAMES;
  return RESIDENTIAL_COLLEGE_NAMES.filter(
    (college) => college.toLowerCase().includes(query.value.toLowerCase())
  );
});
</script>

<template>
  <q-select v-model="modelValue" label="Residential College" :options="filteredColleges" use-input filled
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