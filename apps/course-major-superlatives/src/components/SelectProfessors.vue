<script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { useFormStore } from 'src/stores/form';
import { professors } from 'src/stores/professors';
import { defineProps, ref } from 'vue';

const props = defineProps<{
  keyOfFavoritesStore: keyof ReturnType<typeof useFormStore>;
  label: string;
}>();

const formStore = useFormStore();
const displayedProfessors = ref(professors);

const filterFn: QSelectProps['onFilter'] = (val, update) => {
  if (val === '') {
    update(() => {
      displayedProfessors.value = professors;
    });
    return;
  }

  update(
    () => {
      const needle = val.toLowerCase();
      displayedProfessors.value = professors.filter(
        (professor) => professor.toLowerCase().indexOf(needle) > -1,
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