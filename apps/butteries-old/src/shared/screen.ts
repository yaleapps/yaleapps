import { Screen } from 'quasar';
const BREAKPOINT = 455;
export const isMobile = () => Screen['width'] < BREAKPOINT;
