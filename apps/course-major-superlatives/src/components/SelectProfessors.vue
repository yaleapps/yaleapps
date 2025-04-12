<template>
  <q-select
    v-model="favoritesStore[keyOfFavoritesStore]"
    :label="label"
    :options="displayedProfessors"
    multiple
    use-input
    use-chips
    filled
    menu-self="top middle"
    menu-anchor="bottom middle"
    @filter="filterFn"
  >
  </q-select>
</template>

<script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { useFavoritesStore } from 'src/stores/favorites';
import { professors } from 'src/stores/professors';
import { defineProps, ref } from 'vue';

const props = defineProps<{
  keyOfFavoritesStore: keyof typeof favoritesStore.$state;
  label: string;
}>();

const favoritesStore = useFavoritesStore();

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
