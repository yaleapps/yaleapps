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
import type { AggregatedCourseData, AggregatedProfessorData } from 'src/composables/useSuperlativesChartData';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  data: AggregatedCourseData[] | AggregatedProfessorData[];
  title: string;
  color?: string;
}>()

// Color utility for superlative categories
const superlativeColors = {
  favorite: {
    base: 'hsl(340, 85%, 65%)',  // Warm pink
    hover: 'hsl(340, 85%, 70%)'
  },
  guttiest: {
    base: 'hsl(280, 70%, 65%)',  // Purple
    hover: 'hsl(280, 70%, 70%)'
  },
  professor: {
    base: 'hsl(200, 75%, 60%)',  // Ocean blue
    hover: 'hsl(200, 75%, 65%)'
  },
  regret: {
    base: 'hsl(15, 75%, 65%)',   // Coral
    hover: 'hsl(15, 75%, 70%)'
  },
  unique: {
    base: 'hsl(150, 60%, 60%)',  // Mint
    hover: 'hsl(150, 60%, 65%)'
  },
  default: {
    base: 'hsl(220, 70%, 60%)',  // Default blue
    hover: 'hsl(220, 70%, 65%)'
  }
};

// Helper to determine color based on title
function getChartColor(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('favorite')) return superlativeColors.favorite;
  if (lowerTitle.includes('gutti')) return superlativeColors.guttiest;
  if (lowerTitle.includes('professor')) return superlativeColors.professor;
  if (lowerTitle.includes('regret')) return superlativeColors.regret;
  if (lowerTitle.includes('unique') || lowerTitle.includes('quintessential')) return superlativeColors.unique;
  return superlativeColors.default;
}

function isCourse(item: AggregatedCourseData | AggregatedProfessorData): item is AggregatedCourseData {
  return 'course_codes' in item;
}

const chartData = computed(() => {
  // Create a gradient effect based on position and vote count
  const baseHue = props.title.toLowerCase().includes('quintessential') ? 270 : // Purple for quintessential
    props.title.toLowerCase().includes('professor') ? 200 : // Blue for professors
      props.title.toLowerCase().includes('regret') ? 15 : // Coral for regrets
        props.title.toLowerCase().includes('gutti') ? 280 : // Purple for guttiest
          340; // Pink for others

  return {
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
        backgroundColor: props.data.map((_, index) => {
          // More subtle gradient with higher minimum lightness
          // Calculate percentage through the list (0 to 1)
          const progress = index / (props.data.length - 1);
          // Lightness now ranges from 65% to 75%
          const lightness = 65 + (progress * 10);
          // Saturation now ranges from 85% to 70%
          const saturation = 85 - (progress * 15);
          return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
        }),
        hoverBackgroundColor: props.data.map((_, index) => {
          const progress = index / (props.data.length - 1);
          // Hover states are slightly brighter
          const lightness = 60 + (progress * 10);
          const saturation = 90 - (progress * 15);
          return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
        }),
        borderRadius: 8,
        maxBarThickness: 50,
        borderSkipped: false,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  animation: { duration: 500 },
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
      displayColors: true,
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