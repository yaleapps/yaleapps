# <script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { useFavoritesStore } from 'src/stores/favorites';
import { professors } from 'src/stores/professors';
import { defineProps, ref } from 'vue';

const props = defineProps<{
  keyOfFavoritesStore: keyof ReturnType<typeof useFavoritesStore>;
  label: string;
}>();

const store = useFavoritesStore();
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
  <q-select
    v-model="store[props.keyOfFavoritesStore]"
    :label="props.label"
    :options="displayedProfessors"
    multiple
    use-input
    use-chips
    filled
    menu-self="top middle"
    menu-anchor="bottom middle"
    @filter="filterFn"
  />
</template>