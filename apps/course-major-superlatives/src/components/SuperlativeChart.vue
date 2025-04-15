<!-- A reusable chart component for superlatives data -->
<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type Scale,
} from 'chart.js';
import { computed } from 'vue';
import type { AggregatedCourseData, AggregatedProfessorData } from 'src/composables/useSuperlativesData';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  data: AggregatedCourseData[] | AggregatedProfessorData[];
  title: string;
  color?: string;
}>()

function isCourse(item: AggregatedCourseData | AggregatedProfessorData): item is AggregatedCourseData {
  return 'course_codes' in item;
}

const chartData = computed(() => ({
  labels: props.data.map(item => {
    if (isCourse(item)) {
      return `${item.title} (${item.course_codes.join(' | ')})`;
    }
    return `${item.name}`;

  }),
  datasets: [
    {
      label: 'Number of Votes',
      data: props.data.map(item => item.count),
      backgroundColor: props.color,
      borderRadius: 8,
      maxBarThickness: 50,
      borderSkipped: false,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: props.title,
      font: {
        size: 20,
        weight: 'bold' as const,
        family: "'Inter', system-ui, sans-serif",
      },
      padding: {
        top: 20,
        bottom: 30,
      },
      color: '#1e293b', // slate-800
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
      displayColors: false,
      callbacks: {
        title: (tooltipItems: { label: string }[]) => {
          const item = tooltipItems[0];
          if (!item?.label) return '';
          return item.label;
        },
        label: (context: { formattedValue: string }) => {
          return `${context.formattedValue} votes`;
        }
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          family: "'Inter', system-ui, sans-serif",
          size: 12,
        },
        padding: 8,
        callback: function (this: Scale, tickValue: string | number) {
          const index = typeof tickValue === 'number' ? tickValue : Number.parseInt(tickValue, 10);
          const label = chartData.value.labels[index];
          if (!label) return '';
          return label.length > 40
            ? `${label.substring(0, 40)}...`
            : label;
        }
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      }
    },
    x: {
      grid: {
        display: true,
        color: '#e2e8f0', // slate-200
        drawBorder: false,
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        stepSize: 1,
        font: {
          family: "'Inter', system-ui, sans-serif",
          size: 12,
        },
        padding: 8,
      },
      border: {
        display: false,
      }
    },
  },
}));

// Calculate minimum height based on number of items
const minChartHeight = computed(() => {
  // Allocate at least 40px per bar for readability
  return Math.max(props.data.length * 40, 300);
});
</script>

<template>
  <div class="tw:relative tw:w-full tw:overflow-hidden">
    <div class="tw:overflow-x-auto tw:pb-4">
      <div :style="{ width: '100%', minWidth: '400px', height: `${minChartHeight}px` }">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>