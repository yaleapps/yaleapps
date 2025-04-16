<!-- A specialized chart component for major popularity visualization -->
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
  type ScriptableContext,
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

// Chart data for major popularity
const chartData = computed<ChartData<'bar'>>(() => {
  const sortedData = [...props.data].sort((a, b) => b.count - a.count);
  return {
    labels: sortedData.map(stat => stat.major.replace(' (B.A.)', '').replace(' (B.S.)', '')),
    datasets: [
      {
        label: 'Number of Students',
        data: sortedData.map(stat => stat.count),
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const count = ctx.chart?.data?.datasets?.[0]?.data?.length ?? 0;
          return `hsl(${150 + (ctx.dataIndex * 360 / count)}, 70%, 60%)`;
        },
        borderRadius: 8,
      }
    ],
  };
});

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
      text: props.title || 'Major Popularity',
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
          return `${context.formattedValue} students`;
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
        <li>Shows number of students in each major</li>
        <li>Sorted by popularity (most to least common)</li>
        <li>Includes all declared majors from responses</li>
        <li>Consider that some students may have multiple majors</li>
      </ul>
    </q-banner>
  </div>
</template>