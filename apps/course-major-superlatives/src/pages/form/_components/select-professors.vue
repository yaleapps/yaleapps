<script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { useFormStore } from 'src/stores/form';
import { useProfessorsStore } from 'src/stores/data/professors';
import { ref } from 'vue';

const props = defineProps<{
  keyOfFavoritesStore: keyof ReturnType<typeof useFormStore>;
  label: string;
}>();

const professorsStore = useProfessorsStore();
const formStore = useFormStore();
const displayedProfessors = ref(professorsStore.professors);

const filterFn: QSelectProps['onFilter'] = (val, update) => {
  if (val === '') {
    update(() => {
      displayedProfessors.value = professorsStore.professors;
    });
    return;
  }

  update(
    () => {
      const needle = val.toLowerCase();
      displayedProfessors.value = professorsStore.professors.filter(
        (professor) => professor.name.toLowerCase().indexOf(needle) > -1,
      );
    },
    (ref) => {
      ref.setOptionIndex(-1);
      ref.moveOptionSelection(1, true);
    },
  );
};
</script>

<template>
  <q-select v-model="formStore[props.keyOfFavoritesStore]" :label="props.label" :options="displayedProfessors" multiple
    use-input use-chips filled menu-self="top middle" menu-anchor="bottom middle" @filter="filterFn" />
</template>