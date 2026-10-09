import { EventItem } from '../types';

export function hasStarted(event: EventItem, now: Date): boolean {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Damascus',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const currentTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Damascus',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);

  // Fixed YYYY-MM-DD and HH:mm strings can be compared in time order.
  if (event.date < today) {
    return true;
  }

  if (event.date === today && event.time <= currentTime) {
    return true;
  }

  return false;
}
