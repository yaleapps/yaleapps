<template>
  <div style="display: flex; flex-direction: column; gap: 1rem">
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
          <q-btn flat icon="refresh" @click="refresh"></q-btn>
          <q-btn
            flat
            :icon="showSettings ? 'expand_less' : 'expand_more'"
            @click="toggleSettings"
          >
          </q-btn>
        </template>
      </q-input>
    </q-card>

    <q-card flat v-if="showSettings">
      <div class="row justify-between">
        <q-btn-toggle
          v-model="gridCard"
          toggle-color="accent"
          :options="gridCardOptions"
        />
        <q-btn-toggle
          v-model="separator"
          toggle-color="accent"
          :options="separatorOptions"
        />
        <q-option-group
          class="q-mr-md"
          v-model="visibleColumns"
          :options="toggleColumnNames"
          color="accent"
          inline
          type="checkbox"
        />
      </div>
    </q-card>

    <q-table
      flat
      :grid="gridCard"
      grid-header
      card-class="bg-grey-10 text-white"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      :separator="separator"
      row-key="Name"
      :loading="isLoading"
      rows-per-page-label="Snacks per page"
      :pagination="pagination"
      :visible-columns="visibleColumns"
    >
      <template #header="props">
        <q-tr :props="props">
          <!-- <q-th auto-width></q-th> -->
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <!-- <q-th auto-width /> -->
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <!-- <q-td auto-width>
          <q-btn
            v-if="props['In Stock'] === 'FALSE'"
            size="xs"
            color="negative"
            flat
            round
            dense
            icon="remove_shopping_cart"
          >
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
              >Out of Stock</q-tooltip
            >
          </q-btn>
          <q-btn
            v-else
            size="xs"
            color="accent"
            flat
            round
            dense
            icon="shopping_cart"
          >
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
              >In Stock</q-tooltip
            >
          </q-btn>
        </q-td> -->
          <q-td key="Name" :props="props">
            <div class="text-subtitle2">{{ props.row.Name }}</div>
          </q-td>
          <q-td key="Price" :props="props">
            <q-badge :color="`${priceGradient(props.row.Price)}-2`">
              <div
                :class="`text-subtitle2 text-bold
              text-${priceGradient(props.row.Price)}-6`"
              >
                {{ props.row.Price }}
              </div>
            </q-badge>
          </q-td>
          <q-td key="Residential College" :props="props">
            <div class="text-subtitle2">
              {{ props.row['Residential College'] }}
            </div>
          </q-td>
          <q-td key="Category" :props="props">
            <div class="text-subtitle2">
              {{ props.row['Category'] }}
            </div>
          </q-td>
          <!-- <q-td auto-width>
          <q-btn
            size="xs"
            color="accent"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'description'"
          />
        </q-td> -->
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-card flat>
              <!-- {{
                props.row['In Stock'] === 'FALSE' ? 'Out of Stock' : 'In Stock'
              }} -->
              <p v-if="props.row.Description">
                Description: {{ props.row.Description }}
              </p>
              <p v-if="props.row.Ingredients">
                Ingredients: {{ props.row.Ingredients }}
              </p>
            </q-card>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { Column, ColumnName, getTableData } from './getTableData';
import { Buttery } from 'src/shared/butteries';
const $q = useQuasar();

const props = defineProps({
  filterId: {
    type: String as PropType<Buttery['id']>,
    default: null,
  },
  visibleColumns: {
    type: Array as PropType<ColumnName[]>,
    default: () => ['Name', 'Price', 'Residential College'],
  },
});

const { isLoading, data: tableData } = useQuery({
  queryKey: ['menus', props.filterId] as [string, Buttery['id']],
  queryFn: ({ queryKey }) => getTableData(queryKey[1]),
});
const queryClient = useQueryClient();
const refresh = () => queryClient.invalidateQueries({ queryKey: ['todos'] });

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 300,
});

const columns: Column[] = [
  {
    name: 'Name',
    label: 'Name',
    field: 'Name',
    align: 'left',
    required: true,
    sortable: true,
  },
  {
    name: 'Price',
    label: 'Price',
    field: 'Price',
    sortable: true,
  },
  {
    name: 'Residential College',
    label: 'Residential College',
    field: 'Residential College',
    sortable: true,
  },
  {
    name: 'Category',
    // required: true,
    label: 'Category',
    field: 'Category',
    // align: 'left',
    sortable: true,
  },
];
const toggleColumnNames = columns.map((column) => ({
  label: column.field,
  value: column.field,
}));
const visibleColumns = ref(props.visibleColumns);

const showSettings = ref(false);
function toggleSettings() {
  showSettings.value = !showSettings.value;
}

const filter = ref('');
const gridCard = ref($q.screen.lt.md);
const gridCardOptions = [
  { label: '', value: true, icon: 'view_module' },
  { label: '', value: false, icon: 'view_list' },
];
const separator = ref('vertical') as Ref<
  'vertical' | 'horizontal' | 'cell' | 'none'
>;
const separatorOptions = [
  { label: '', value: 'horizontal', icon: 'view_headline' },
  { label: '', value: 'vertical', icon: 'calendar_view_week' },
  { label: '', value: 'cell', icon: 'view_comfy' },
  { label: '', value: 'none', icon: 'grid_off' },
];

function priceGradient(price: string) {
  const priceNum = parseFloat(price);
  if (priceNum < 2) {
    return 'green';
  } else if (priceNum < 4) {
    return 'orange';
  } else {
    return 'red';
  }
}

const searchInput = ref() as Ref<HTMLInputElement>;
onMounted(() => {
  searchInput.value.focus();
});
</script>
