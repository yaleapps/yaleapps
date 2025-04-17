<template>
  <FullCalendar
    :id="props.buttery.calendarID"
    :options="calendarOptions"
    :style="`{height:${calendarHeight}}`"
  ></FullCalendar>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Buttery } from 'src/shared/butteries';
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import timeGridPlugin from '@fullcalendar/timegrid';

const props = defineProps({
  buttery: {
    type: Object as PropType<Buttery>,
    required: true,
  },
});

// --- Begin Calendar Logic ---

const calendarHeight = 300;

const calendarOptions = {
  plugins: [timeGridPlugin, googleCalendarPlugin],
  height: calendarHeight,
  initialView: 'timeGrid3Day',
  headerToolbar: {
    start: 'prev,next',
    center: '', //'title',
    end: 'timeGridDay,timeGrid3Day,timeGridWeek',
  },
  scrollTime: props.buttery.startTime,
  views: {
    timeGrid3Day: {
      type: 'timeGrid',
      duration: { days: 3 },
      buttonText: '3 day',
    },
  },
  googleCalendarApiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
  events: {
    googleCalendarId: props.buttery.calendarID,
  },
};
</script>
