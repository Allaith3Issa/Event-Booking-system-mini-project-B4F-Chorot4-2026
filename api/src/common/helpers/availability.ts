import { EventItem, Booking, EventStatus } from '../../types';
import { hasStarted } from './time';

export function computeAvailability(
  event: EventItem,
  bookings: Booking[],
  now: Date,
): {
  booked: number;
  remaining: number;
  bookingPercentage: number;
  status: EventStatus;
} {
  let booked = 0;

  for (const booking of bookings) {
    if (booking.eventId === event.id && booking.status === 'Active') {
      booked = booked + booking.places;
    }
  }

  const remaining = event.capacity - booked;
  const bookingPercentage = Math.round((booked / event.capacity) * 100);
  let status: EventStatus = 'Available';

  if (hasStarted(event, now)) {
    status = 'Past';
  } else if (remaining === 0) {
    status = 'Full';
  } else if (bookingPercentage >= 90) {
    status = 'Almost full';
  }

  return {
    booked: booked,
    remaining: remaining,
    bookingPercentage: bookingPercentage,
    status: status,
  };
}
