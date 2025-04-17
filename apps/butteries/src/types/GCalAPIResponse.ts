import { Buttery } from 'src/shared/butteries';

export interface GCalAPIResponse {
  kind: string;
  timeMin: string;
  timeMax: string;
  calendars: { [key: Buttery['calendarID']]: Calendar };
}

export interface Calendar {
  busy: Busy[];
}

export interface Busy {
  start: string;
  end: string;
}
