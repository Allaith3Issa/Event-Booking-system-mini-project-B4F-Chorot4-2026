import { EventItem, SortBy } from '../../types';

export default function eventSortBy(
  events: EventItem[],
  sortBy: SortBy,
  asc: boolean,
) {
  events.sort((a, b) => {
    if (sortBy === 'date') {
      if (a.date < b.date) return asc ? -1 : 1;
      if (a.date > b.date) return asc ? 1 : -1;
      if (a.time < b.time) return asc ? -1 : 1;
      if (a.time > b.time) return asc ? 1 : -1;

      return 0;
    } else if (sortBy === 'remaining') {
      if (a.remaining < b.remaining) return asc ? -1 : 1;
      if (a.remaining > b.remaining) return asc ? 1 : -1;
      return 0;
    } else if (sortBy === 'popularity') {
      if (a.bookingPercentage < b.bookingPercentage) return asc ? -1 : 1;
      if (a.bookingPercentage > b.bookingPercentage) return asc ? 1 : -1;
      return 0;
    }
  });
}
