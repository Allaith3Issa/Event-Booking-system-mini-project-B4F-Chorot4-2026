export type EventStatus = 'Available' | 'Almost full' | 'Full' | 'Past';
export type EventsCategories =
  'Workshop' | 'Talk' | 'Concert' | 'Sports' | 'Meetup';
export const ALLOWED_EVENTS_CATEGORIES: EventsCategories[] = [
  'Workshop',
  'Talk',
  'Concert',
  'Sports',
  'Meetup',
];
export type BookingStatus = 'Active' | 'Cancelled';
export type SortBy = 'date' | 'remaining' | 'popularity';
export const SORT_BY_VERDICTS: SortBy[] = ['date', 'remaining', 'popularity'];

export interface EventItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm" (24h)
  location: string;
  category: EventsCategories; // Workshop | Talk | Concert | Sports | Meetup ...
  capacity: number;
  booked: number; // computed from Active bookings only
  remaining: number; // capacity - booked
  bookingPercentage: number; // whole number 0..100
  status: EventStatus;
}

export interface Booking {
  id: number;
  code: string; // "EV-2093"
  eventId: number;
  event: EventItem; // with UPDATED availability
  customerName: string;
  customerPhone: string;
  places: number; // 1..4
  bookedAt: string; // ISO date-time
  status: BookingStatus;
  canCancel: boolean; // computed by backend: Active AND event not started
  cancelledAt?: string;
}
export interface CreateBookingData {
  eventId: number;
  customerName: string;
  customerPhone: string;
  places: number;
}
export interface ApiError {
  statusCode: number;
  message: string; // one readable sentence, ready to display
}
