<!-- A specialized chart component for major rating distribution visualization -->
<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type TooltipItem
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors
);

interface MajorStat {
  major: string;
  average: number;
  count: number;
  ratings: number[];
  totalRatings: number;
}

const props = defineProps<{
  data: MajorStat[];
  title?: string;
}>();

// Individual major distribution chart options
const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '',  // Will be set per chart
      font: {
        size: 16,
        weight: 'bold',
        family: "'Inter', system-ui, sans-serif",
      },
      padding: {
        top: 10,
        bottom: 15,
      },
      color: '#1e293b',
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: {
        size: 13,
        family: "'Inter', system-ui, sans-serif",
      },
      bodyFont: {
        size: 12,
        family: "'Inter', system-ui, sans-serif",
      },
      padding: 8,
      cornerRadius: 6,
      callbacks: {
        title: (items: TooltipItem<'bar'>[]) => items[0]?.label ?? '',
        label: (context) => `${context.formattedValue} responses`,
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#e2e8f0',
      },
      border: {
        display: false,
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0,
      }
    },
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0,
      }
    },
  },
}));

// Generate chart data for a single major
function getMajorDistributionData(majorStat: MajorStat): ChartData<'bar'> {
  return {
    labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
    datasets: [{
      data: majorStat.ratings,
      backgroundColor: Array.from({ length: 10 }, (_, i) =>
        `hsl(${Math.floor(220 + (i * 14))}, 70%, ${50 + (i * 5)}%)`
      ),
      borderRadius: 6,
    }],
  };
}

// Get options for individual major chart
function getMajorChartOptions(majorStat: MajorStat): ChartOptions<'bar'> {
  return {
    ...chartOptions.value,
    plugins: {
      ...chartOptions.value.plugins,
      title: {
        ...chartOptions.value.plugins?.title,
        display: true,
        text: majorStat.major.replace(' (B.A.)', '').replace(' (B.S.)', '')
      }
    }
  };
}
</script>

<template>
  <div class="tw:space-y-4">
    <div class="tw:relative tw:w-full tw:overflow-hidden">
      <div class="tw:overflow-x-auto tw:pb-4">
        <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6">
          <div v-for="majorStat in props.data" :key="majorStat.major"
            class="tw:bg-white tw:rounded-lg tw:shadow-sm tw:p-4">
            <div :style="{ height: '250px' }">
              <Bar :data="getMajorDistributionData(majorStat)" :options="getMajorChartOptions(majorStat)" />
            </div>
            <div class="tw:mt-2 tw:text-sm tw:text-gray-600">
              Average: {{ majorStat.average.toFixed(2) }} | Responses: {{ majorStat.totalRatings }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-banner rounded class="bg-info">
      <template v-slot:avatar>
        ℹ️
      </template>
      <div class="text-subtitle2 q-mb-sm">About This Visualization</div>
      <ul class="tw:list-disc tw:ml-4 tw:space-y-1">
        <li>Each chart shows rating distribution for a single major</li>
        <li>X-axis shows ratings (1-10), Y-axis shows number of responses</li>
        <li>Colors indicate rating values (darker = higher rating)</li>
        <li>Average rating and total responses shown below each chart</li>
        <li>Consider sample size when interpreting results</li>
      </ul>
    </q-banner>
  </div>
</template>