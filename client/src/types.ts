export type EventStatus = "Available" | "Almost full" | "Full" | "Past";
export type BookingStatus = "Active" | "Cancelled";

export interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm" (24h)
  location: string;
  category: string; // Workshop | Talk | Concert | Sports | Meetup ...
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
}

export interface ApiError {
  statusCode: number;
  message: string; // one readable sentence, ready to display
}
