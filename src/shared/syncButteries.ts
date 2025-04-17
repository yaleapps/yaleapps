import axios from 'axios';
import { Buttery } from './butteries';
import { GCalAPIResponse } from 'src/types/GCalAPIResponse';

/*** Fetch the Google Calendar schedule and save it into gcalButterySchedule */
export async function refreshGcalButterySchedule(butteries: Buttery[]) {
  const startRange = new Date(new Date().setDate(new Date().getDate() - 1));
  const endRange = new Date(new Date().setDate(new Date().getDate() + 30));
  const startRangeISO = startRange.toISOString();
  const endRangeISO = endRange.toISOString();
  const requestBody = {
    timeMin: startRangeISO,
    timeMax: endRangeISO,
    items: butteries.map((buttery) => ({
      id: buttery.calendarID,
    })),
  };
  const { data } = (await axios({
    url: `https://www.googleapis.com/calendar/v3/freeBusy?key=${
      import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
    }`,
    method: 'POST',
    data: requestBody,
  })) as { data: GCalAPIResponse };
  return data.calendars;
}
