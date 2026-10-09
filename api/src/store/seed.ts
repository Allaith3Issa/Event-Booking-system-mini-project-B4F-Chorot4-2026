import { EventItem, Booking } from '../types';
import { computeAvailability } from '../common/helpers/availability';
import { hasStarted } from '../common/helpers/time';

const now = new Date();
const placeholderImageUrl =
  'http://localhost:3000/assets/images/placeholder.jpg';

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Damascus',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(now);

function dateAfterDays(days: number): string {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const bookedAt = `${dateAfterDays(-14)}T00:00:00.000Z`;

export const seedEvents: EventItem[] = [
  {
    id: 1,
    imageUrl: placeholderImageUrl,
    title: 'Introduction to Web Development',
    description:
      'A beginner-friendly talk about how browsers and servers work together.',
    date: dateAfterDays(-3),
    time: '17:00',
    location: 'Learning Centre, Damascus, Room A',
    category: 'Talk',
    capacity: 40,
    booked: 0,
    remaining: 40,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 2,
    imageUrl: placeholderImageUrl,
    title: 'Small Team Photography Workshop',
    description:
      'Practice composition and lighting with a small group of learners.',
    date: dateAfterDays(2),
    time: '10:00',
    location: 'Creative Studio, Damascus',
    category: 'Workshop',
    capacity: 10,
    booked: 0,
    remaining: 10,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 3,
    imageUrl: placeholderImageUrl,
    title: 'UI Design Basics',
    description:
      'A hands-on introduction to layouts, typography, and accessible interfaces.',
    date: dateAfterDays(3),
    time: '18:00',
    location: 'Learning Centre, Damascus, Hall B',
    category: 'Workshop',
    capacity: 7,
    booked: 0,
    remaining: 7,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 4,
    imageUrl: placeholderImageUrl,
    title: 'Acoustic Music Evening',
    description:
      'An intimate evening of live acoustic music by local performers.',
    date: dateAfterDays(4),
    time: '19:30',
    location: 'Community Arts Hall, Damascus',
    category: 'Concert',
    capacity: 10,
    booked: 0,
    remaining: 10,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 5,
    imageUrl: placeholderImageUrl,
    title: 'Community Football Practice',
    description:
      'Friendly drills and short games for players of all experience levels.',
    date: dateAfterDays(5),
    time: '09:00',
    location: 'Community Sports Ground, Damascus',
    category: 'Sports',
    capacity: 24,
    booked: 0,
    remaining: 24,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 6,
    imageUrl: placeholderImageUrl,
    title: 'Junior Developers Meetup',
    description:
      'Meet other learners, share project ideas, and discuss internship experiences.',
    date: dateAfterDays(3),
    time: '16:00',
    location: 'Learning Centre, Damascus, Room C',
    category: 'Meetup',
    capacity: 50,
    booked: 0,
    remaining: 50,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 7,
    imageUrl: placeholderImageUrl,
    title: 'Writing Your First CV',
    description:
      'Practical advice on presenting skills and preparing for a first interview.',
    date: dateAfterDays(7),
    time: '17:30',
    location: 'Community Library, Damascus',
    category: 'Talk',
    capacity: 60,
    booked: 0,
    remaining: 60,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 8,
    imageUrl: placeholderImageUrl,
    title: 'JavaScript Problem Solving',
    description:
      'Work through beginner exercises together and explain your solutions.',
    date: dateAfterDays(8),
    time: '11:00',
    location: 'Learning Centre, Damascus, Computer Lab',
    category: 'Workshop',
    capacity: 16,
    booked: 0,
    remaining: 16,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 9,
    imageUrl: placeholderImageUrl,
    title: 'Community Choir Concert',
    description:
      'A live performance featuring traditional songs and contemporary arrangements.',
    date: dateAfterDays(10),
    time: '19:00',
    location: 'Community Arts Hall, Damascus',
    category: 'Concert',
    capacity: 100,
    booked: 0,
    remaining: 100,
    bookingPercentage: 0,
    status: 'Available',
  },
  {
    id: 10,
    imageUrl: placeholderImageUrl,
    title: 'Morning Walking Group',
    description:
      'A relaxed group walk with a short warm-up and time to meet new people.',
    date: dateAfterDays(6),
    time: '08:00',
    location: 'Park Meeting Point, Damascus',
    category: 'Sports',
    capacity: 35,
    booked: 0,
    remaining: 35,
    bookingPercentage: 0,
    status: 'Available',
  },
];

export const seedBookings: Booking[] = [
  {
    id: 1,
    code: 'EV-1001',
    eventId: 1,
    event: seedEvents.find((event) => event.id === 1),
    customerName: 'Omar Hassan',
    customerPhone: '0930000001',
    places: 2,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 2,
    code: 'EV-1002',
    eventId: 2,
    event: seedEvents.find((event) => event.id === 2),
    customerName: 'Lina Khalil',
    customerPhone: '0930000002',
    places: 4,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 3,
    code: 'EV-1003',
    eventId: 2,
    event: seedEvents.find((event) => event.id === 2),
    customerName: 'Rami Saleh',
    customerPhone: '0930000003',
    places: 4,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 4,
    code: 'EV-1004',
    eventId: 2,
    event: seedEvents.find((event) => event.id === 2),
    customerName: 'Hala Nasser',
    customerPhone: '0930000004',
    places: 2,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 5,
    code: 'EV-1005',
    eventId: 3,
    event: seedEvents.find((event) => event.id === 3),
    customerName: 'Sara Ahmad',
    customerPhone: '0930000005',
    places: 4,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 6,
    code: 'EV-1006',
    eventId: 4,
    event: seedEvents.find((event) => event.id === 4),
    customerName: 'Yazan Ali',
    customerPhone: '0930000006',
    places: 4,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 7,
    code: 'EV-1007',
    eventId: 4,
    event: seedEvents.find((event) => event.id === 4),
    customerName: 'Nour Hamdan',
    customerPhone: '0930000007',
    places: 4,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 8,
    code: 'EV-1008',
    eventId: 4,
    event: seedEvents.find((event) => event.id === 4),
    customerName: 'Kareem Mustafa',
    customerPhone: '0930000008',
    places: 1,
    bookedAt,
    status: 'Active',
    canCancel: false,
  },
  {
    id: 9,
    code: 'EV-1009',
    eventId: 3,
    event: seedEvents.find((event) => event.id === 3),
    customerName: 'Maya Ibrahim',
    customerPhone: '0930000009',
    places: 2,
    bookedAt,
    status: 'Cancelled',
    canCancel: false,
  },
  {
    id: 10,
    code: 'EV-1010',
    eventId: 4,
    event: seedEvents.find((event) => event.id === 4),
    customerName: 'Fadi Darwish',
    customerPhone: '0930000010',
    places: 3,
    bookedAt,
    status: 'Cancelled',
    canCancel: false,
  },
];

for (const event of seedEvents) {
  const availability = computeAvailability(event, seedBookings, now);
  event.booked = availability.booked;
  event.remaining = availability.remaining;
  event.bookingPercentage = availability.bookingPercentage;
  event.status = availability.status;
}

for (const booking of seedBookings) {
  booking.canCancel =
    booking.status === 'Active' && !hasStarted(booking.event, now);
}
