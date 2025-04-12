<template>
  <q-page padding>
    <q-card flat>
      <q-input filled dense debounce="300" v-model="filter" placeholder="Search Courses...">
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
      :rows="courses"
      :columns="columns"
      row-key="listing_id"
      :visible-columns="toggledColumns"
      virtual-scroll
      style="height: calc(100vh - 144px)"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :filter="filter"
      flat
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <template v-if="Array.isArray(props.value)">
            <q-badge
              v-for="(item, index) in props.value"
              :key="index"
              color="blue"
              :label="item"
              class="q-mr-sm text-body2"
            />
          </template>
          <template v-else-if="props.value && Number(props.value) >= 0 && Number(props.value) <= 5">
            <q-badge :color="`${priceGradient(props.value)}-3`">
              <div :class="`text-body2 text-${priceGradient(props.value)}-10`">
                {{ props.value }}
              </div>
            </q-badge>
          </template>
          <template v-else>
            <div class="text-body2">
              {{ props.value }}
            </div>
          </template>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
export default {
  async preFetch({ store }) {
    const coursesStore = useCoursesStore(store);
    coursesStore.fetchCatalog();
  },
};
</script>

<script setup lang="ts">
import { useCoursesStore } from 'src/stores/courses';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

function priceGradient(value: number) {
  const rangeColors = ['red', 'orange', 'lime', 'light-green', 'teal'];
  return rangeColors[Math.round(value) - 1];
}

const coursesStore = useCoursesStore();
const { courses, columns, toggledColumns, filter, pagination } = storeToRefs(coursesStore);

const showSettings = ref(false);
function toggleSettings() {
  showSettings.value = !showSettings.value;
}
</script>
