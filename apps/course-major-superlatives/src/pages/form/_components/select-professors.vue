<script setup lang="ts">
import { useProfessorsStore } from 'src/stores/data/professors';
import { ref } from 'vue';

const modelValue = defineModel<string[]>({ required: true });
defineProps<{ label: string; }>();

const professorsStore = useProfessorsStore();
const filteredProfessors = ref(professorsStore.professors);
</script>

<template>
  <q-select v-model="modelValue" :label="label" :options="filteredProfessors" multiple use-input use-chips filled
    menu-self="top middle" menu-anchor="bottom middle" @filter="(query, update) => {
      if (query === '') {
        update(() => filteredProfessors = professorsStore.professors);
        return;
      }
      update(
        () => {
          filteredProfessors = professorsStore.professors.filter(
            (professor) => professor.name.toLowerCase().indexOf(query.toLowerCase()) > -1,
          );
        },
        (ref) => {
          ref.setOptionIndex(-1);
          ref.moveOptionSelection(1, true);
        },
      );
    }" />
</template>