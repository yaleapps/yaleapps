<template>
  <q-page class="q-pa-md">
    <q-card flat>
      <q-input
        filled
        dense
        debounce="300"
        v-model="filter"
        placeholder="Search Menus..."
        ref="searchInput"
      >
        <template #append>
          <q-icon name="search" />
        </template>
        <template #after>
          <q-btn flat :icon="showSettings ? 'expand_less' : 'expand_more'" @click="toggleSettings">
          </q-btn>
        </template>
      </q-input>
    </q-card>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="listing_id"
      :loading="isLoading"
      :visible-columns="visibleColumns"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :filter="filter"
      flat
    />
  </q-page>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import type { Database } from 'app/types/supabase';
import { supabase } from 'src/supabase';
import { ref } from 'vue';

type Row = Database['public']['Views']['EvaluationNarrativesToCourses202303']['Row'];
type Column = {
  name: keyof Row;
  label: string;
  field: string;
  sortable: boolean;
  align: 'left' | 'right' | 'center';
};

const showSettings = ref(false);
function toggleSettings() {
  showSettings.value = !showSettings.value;
}
const filter = ref('');

const pagination = ref({
  rowsPerPage: 0,
});

const evaluationNarrativeKeys: (keyof Row)[] = [
  'all_course_codes',
  'comment',
  'comment_compound',
  'areas',
  'skills',
  'title',
];
const columns: Column[] = evaluationNarrativeKeys.map(
  (key): Column => ({
    name: key,
    label: keyToLabel(key),
    field: key,
    sortable: true,
    align: 'left',
  }),
);
const visibleColumns: (keyof Row)[] = [
  'all_course_codes',
  'comment',
  'comment_compound',
  'areas',
  'skills',
  'title',
  'comment',
];

const { isLoading, isFetching, isError, data, error } = useQuery({
  queryKey: ['catalog'],
  queryFn: fetchCatalog,
});

async function fetchCatalog() {
  const { data, error } = await supabase.from('EvaluationNarrativesToCourses202303').select('*');
  return data;
}

// Takes in string like "times_by_day" and returns "Times by Day"
function keyToLabel(label: string) {
  return label
    .split('_')
    .map((word) => word.at(0)?.toUpperCase() + word.slice(1))
    .join(' ');
}

// onBeforeMount(async () => {
//   catalog.value = await fetchCatalog();
// });
</script>
