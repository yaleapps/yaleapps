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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface Props {
  data: Array<{
    courseName?: string;
    courseCode?: string;
    name?: string;
    count: number;
  }>;
  title: string;
  type: 'course' | 'professor';
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#2563eb', // Default to blue-600
});

const chartData = computed(() => ({
  labels: props.data.map(item =>
    props.type === 'course'
      ? `${item.courseCode}: ${item.courseName}`
      : `${item.name}`
  ),
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
          return item.label.length > 50
            ? `${item.label.substring(0, 50)}...`
            : item.label;
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
        stepSize: 1,
        font: {
          family: "'Inter', system-ui, sans-serif",
          size: 12,
        },
        padding: 8,
      },
      grid: {
        display: true,
        color: '#e2e8f0', // slate-200
        drawBorder: false,
      },
      border: {
        display: false,
      }
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        font: {
          family: "'Inter', system-ui, sans-serif",
          size: 12,
        },
        padding: 8,
        callback: function (this: Scale, tickValue: string | number) {
          const index = typeof tickValue === 'number' ? tickValue : Number.parseInt(tickValue, 10);
          const label = chartData.value.labels[index];
          if (!label) return '';
          return label.length > 30
            ? `${label.substring(0, 30)}...`
            : label;
        }
      },
      border: {
        display: false,
      }
    },
  },
}));
</script>

<template>
  <div class="tw:h-[400px] tw:w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>