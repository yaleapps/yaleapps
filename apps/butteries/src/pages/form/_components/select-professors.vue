<script setup lang="ts">
import { useProfessorsStore } from 'src/stores/data/professors';
import type { Professor } from 'src/types/types';
import { computed, ref } from 'vue';

const modelValue = defineModel<Professor[]>({ required: true });
defineProps<{ label: string; }>();

const professorsStore = useProfessorsStore();

const query = ref('');

const filteredProfessors = computed(() => {
  if (query.value === '') return professorsStore.professors;
  return professorsStore.professors.filter(
    (professor) => professor.name.toLowerCase().indexOf(query.value.toLowerCase()) > -1,
  );
});

</script>

<template>
  <q-select v-model="modelValue" :label="label" :options="filteredProfessors" multiple use-input use-chips filled
    :option-label="'name' satisfies keyof Professor" menu-self="top middle" menu-anchor="bottom middle"
    @add="() => query = ''"
    @filter="(q, update) => { update(() => query = q, (ref) => { ref.setOptionIndex(-1); ref.moveOptionSelection(1, true) }) }"
    input-debounce="0">
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ (scope.opt as Professor).name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>