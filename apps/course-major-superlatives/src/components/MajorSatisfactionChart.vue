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
  type ScriptableContext,
  Title,
  Tooltip,
  type TooltipItem
} from 'chart.js';
import {computed, ref} from 'vue';
import {Bar} from 'vue-chartjs';

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

// Track active view
const activeView = ref<'satisfaction' | 'distribution' | 'popularity'>('satisfaction');

// Chart data for satisfaction ratings
const satisfactionChartData = computed<ChartData<'bar'>>(() => ({
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

// Chart data for rating distribution
const distributionChartData = computed<ChartData<'bar'>>(() => ({
  labels: props.data.map(stat => stat.major.replace(' (B.A.)', '').replace(' (B.S.)', '')),
  datasets: Array.from({ length: 10 }, (_, i) => ({
    label: `Rating ${i + 1}`,
    data: props.data.map(stat => stat.ratings[i] || 0),
    backgroundColor: `hsl(${Math.floor(220 + (i * 14))}, 70%, ${50 + (i * 5)}%)`,
    stack: 'ratings',
    borderRadius: 8,
  })),
}));

// Chart data for major popularity
const popularityChartData = computed<ChartData<'bar'>>(() => {
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

// Common chart options
const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: activeView.value === 'distribution' ? 'y' : 'x',
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: getChartTitle(),
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
          if (activeView.value === 'satisfaction') {
            return `Average Rating: ${context.formattedValue}/10`;
          }
          if (activeView.value === 'popularity') {
            return `${context.formattedValue} students`;
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
        maxRotation: activeView.value === 'distribution' ? 0 : 45,
        minRotation: activeView.value === 'distribution' ? 0 : 45,
      }
    },
  },
}));

function getChartTitle() {
  switch (activeView.value) {
    case 'satisfaction':
      return 'Major Satisfaction Ratings';
    case 'distribution':
      return 'Rating Distribution by Major';
    case 'popularity':
      return 'Major Popularity';
    default:
      return props.title || 'Major Analysis';
  }
}

// Calculate minimum height based on view type and data
const minChartHeight = computed(() => {
  if (activeView.value === 'distribution') {
    return Math.max(props.data.length * 40, 300);
  }
  return 400; // Fixed height for vertical charts
});
</script>

<template>
  <div class="tw:space-y-4">
    <div class="tw:flex tw:justify-end tw:space-x-2">
      <q-btn-toggle
        v-model="activeView"
        flat
        :options="[
          { label: 'Satisfaction Ratings', value: 'satisfaction' },
          { label: 'Rating Distribution', value: 'distribution' },
          { label: 'Major Popularity', value: 'popularity' }
        ]"
      />
    </div>

    <div class="tw:relative tw:w-full tw:overflow-hidden">
      <div class="tw:overflow-x-auto tw:pb-4">
        <div :style="{ width: '100%', minWidth: '600px', height: `${minChartHeight}px` }">
          <Bar
            :data="
              activeView === 'satisfaction' 
                ? satisfactionChartData 
                : activeView === 'distribution'
                  ? distributionChartData
                  : popularityChartData
            "
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
        <template v-if="activeView === 'satisfaction'">
          <li>Shows average satisfaction rating for each major</li>
          <li>Ratings are on a scale of 1-10</li>
          <li>Higher bars indicate greater satisfaction</li>
        </template>
        <template v-else-if="activeView === 'distribution'">
          <li>Shows detailed breakdown of ratings (1-10) for each major</li>
          <li>Colors indicate different rating values</li>
          <li>Length of segments shows number of responses for each rating</li>
        </template>
        <template v-else>
          <li>Shows number of students in each major</li>
          <li>Sorted by popularity (most to least common)</li>
          <li>Includes all declared majors from responses</li>
        </template>
        <li>Consider sample size when interpreting results</li>
      </ul>
    </q-banner>
  </div>
</template> 