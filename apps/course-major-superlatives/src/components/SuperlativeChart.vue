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
      borderRadius: 6,
      maxBarThickness: 40,
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
        size: 16,
        weight: 'bold',
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: '#1e293b', // slate-800
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
}));
</script>

<template>
  <div class="tw:h-[400px] tw:w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>