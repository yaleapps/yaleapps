<!-- A specialized chart component for major satisfaction visualization -->
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
  Colors,
  type TooltipItem,
  type ChartData,
} from 'chart.js';
import { computed, ref } from 'vue';
import type { Major } from '@repo/constants';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors
);


const props = defineProps<{
  data: Record<Major, number>[];
  title?: string;
  color?: string;
}>();

// Track active view
const activeView = ref<'average' | 'distribution'>('average');

// Process data to get major statistics
const majorStats = computed(() => {
  const stats = new Map<string, { total: number; count: number; ratings: number[] }>();
  
  // Process each submission
  for (const submission of props.data) {
    // Get all majors and their satisfaction ratings
    for (const [major, rating] of Object.entries(submission.selected_major_satisfaction)) {
      if (!stats.has(major)) {
        stats.set(major, { total: 0, count: 0, ratings: Array(10).fill(0) });
      }
      const majorStat = stats.get(major);
      if (!majorStat) continue;
      
      majorStat.total += rating;
      majorStat.count++;
      majorStat.ratings[rating - 1]++; // Adjust for 0-based array
    }
  }

  // Convert to array and sort by average satisfaction
  return Array.from(stats.entries())
    .map(([major, data]) => ({
      major,
      average: data.total / data.count,
      count: data.count,
      ratings: data.ratings,
    }))
    .sort((a, b) => b.average - a.average);
});

// Chart data for average satisfaction
const averageChartData = computed(() => ({
  labels: majorStats.value.map(stat => stat.major.replace(' (B.A.)', '').replace(' (B.S.)', '')),
  datasets: [
    {
      label: 'Average Satisfaction',
      data: majorStats.value.map(stat => stat.average.toFixed(2)),
      backgroundColor: props.color || '#2563eb',
      borderRadius: 8,
      maxBarThickness: 50,
    },
    {
      label: 'Number of Responses',
      data: majorStats.value.map(stat => stat.count),
      backgroundColor: '#94a3b8',
      borderRadius: 8,
      maxBarThickness: 50,
    }
  ],
}));

// Chart data for rating distribution
const distributionChartData = computed(() => ({
  labels: majorStats.value.map(stat => stat.major.replace(' (B.A.)', '').replace(' (B.S.)', '')),
  datasets: Array.from({ length: 10 }, (_, i) => ({
    label: `Rating ${i + 1}`,
    data: majorStats.value.map(stat => stat.ratings[i]),
    backgroundColor: `hsl(${Math.floor(220 + (i * 14))}, 100%, ${50 + (i * 5)}%)`,
    stack: 'ratings',
    borderRadius: 8,
    maxBarThickness: 50,
  })),
}));

// Common chart options
const chartOptions = computed(() => ({
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
      text: props.title || 'Major Satisfaction Analysis',
      font: {
        size: 20,
        weight: 'bold' as const,
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
          if (activeView.value === 'average') {
            const datasetLabel = context.dataset.label;
            if (datasetLabel === 'Average Satisfaction') {
              return `Average: ${context.formattedValue}/10`;
            }
            return `${context.formattedValue} responses`;
          }
          return `${context.dataset.label}: ${context.formattedValue} responses`;
        }
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
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

// Calculate minimum height based on number of majors
const minChartHeight = computed(() => {
  return Math.max(majorStats.value.length * 40, 300);
});
</script>

<template>
  <div class="tw:space-y-4">
    <div class="tw:flex tw:justify-end tw:space-x-2">
      <q-btn-toggle
        v-model="activeView"
        flat
        :options="[
          { label: 'Average Satisfaction', value: 'average' },
          { label: 'Rating Distribution', value: 'distribution' }
        ]"
      />
    </div>

    <div class="tw:relative tw:w-full tw:overflow-hidden">
      <div class="tw:overflow-x-auto tw:pb-4">
        <div :style="{ width: '100%', minWidth: '600px', height: `${minChartHeight}px` }">
          <Bar
            :data="activeView === 'average' ? averageChartData : distributionChartData"
            :options="chartOptions"
          />
        </div>
      </div>
    </div>

    <q-banner rounded class="bg-info">
      <template v-slot:avatar>
        ℹ️
      </template>
      <div class="text-subtitle2 q-mb-sm">About This Visualization</div>
      <ul class="tw:list-disc tw:ml-4 tw:space-y-1">
        <li>Average view shows mean satisfaction rating and response count per major</li>
        <li>Distribution view shows detailed breakdown of ratings (1-10) for each major</li>
        <li>Longer bars indicate more responses in that category</li>
        <li>Consider sample size when interpreting results</li>
      </ul>
    </q-banner>
  </div>
</template> 