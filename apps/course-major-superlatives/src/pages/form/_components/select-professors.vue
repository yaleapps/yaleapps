<script setup lang="ts">
import { useProfessorsStore } from 'src/stores/data/professors';
import { computed, ref } from 'vue';

const modelValue = defineModel<string[]>({ required: true });
defineProps<{ label: string; }>();

const professorsStore = useProfessorsStore();

const query = ref('');

const filteredProfessors = computed(() => {
  if (query.value === '') return professorsStore.professors.map((p) => p.name);
  return professorsStore.professors.filter(
    (professor) => professor.name.toLowerCase().indexOf(query.value.toLowerCase()) > -1,
  ).map((p) => p.name);
});

</script>

<template>
  <q-select v-model="modelValue" :label="label" :options="filteredProfessors" multiple use-input use-chips flat
    menu-self="top middle" menu-anchor="bottom middle" @add="() => query = ''" @filter="(q, update) => {
      update(
        () => query = q,
        (ref) => {
          ref.setOptionIndex(-1);
          ref.moveOptionSelection(1, true);
        },
      );
    }" />

</template>