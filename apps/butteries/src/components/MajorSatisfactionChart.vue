<!-- A specialized chart component for major satisfaction visualization -->
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

// Chart data for satisfaction ratings
const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.data.map(stat => stat.major.replace(' (B.A.)', '').replace(' (B.S.)', '')),
  datasets: [
    {
      label: 'Average Satisfaction (out of 10)',
      data: props.data.map(stat => Number(stat.average.toFixed(2))),
      backgroundColor: props.data.map(
        (_, i) => `hsl(${220 + (i * 360 / props.data.length)}, 70%, 60%)`
      ),
      borderRadius: 8,
    }
  ],
}));

// Chart options
const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: props.title || 'Major Satisfaction Ratings',
      font: {
        size: 20,
        weight: 'bold',
        family: "'Inter', system-ui, sans-serif",
      },
      padding: {
        top: 20,
        bottom: 30,
      },
      color: '#1e293b',
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: {
        size: 14,
        family: "'Inter', system-ui, sans-serif",
      },
      bodyFont: {
        size: 13,
        family: "'Inter', system-ui, sans-serif",
      },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        title: (tooltipItems: TooltipItem<"bar">[]) => {
          const item = tooltipItems[0];
          if (!item?.label) return '';
          return item.label;
        },
        label: (context: TooltipItem<"bar">) => {
          return `Average Rating: ${context.formattedValue}/10`;
        }
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
        display: true,
        color: '#e2e8f0',
      },
      border: {
        display: false,
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        max: 10,
      }
    },
  },
}));

// Calculate minimum height based on data
const minChartHeight = computed(() => Math.max(props.data.length * 40, 400));
</script>

<template>
  <div class="tw:space-y-4">
    <div class="tw:relative tw:w-full tw:overflow-hidden">
      <div class="tw:overflow-x-auto tw:pb-4">
        <div :style="{ width: '100%', minWidth: '600px', height: `${minChartHeight}px` }">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <q-banner rounded class="bg-info">
      <template v-slot:avatar>
        ℹ️
      </template>
      <div class="text-subtitle2 q-mb-sm">About This Visualization</div>
      <ul class="tw:list-disc tw:ml-4 tw:space-y-1">
        <li>Shows average satisfaction rating for each major</li>
        <li>Ratings are on a scale of 1-10</li>
        <li>Higher bars indicate greater satisfaction</li>
        <li>Consider sample size when interpreting results</li>
      </ul>
    </q-banner>
  </div>
</template>