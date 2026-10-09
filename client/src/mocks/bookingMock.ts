import { EventItem, Booking, ApiError } from "../types";

// Seed events matching API Contract & UI Design specification
const mockEvents: EventItem[] = [
  {
    id: "e1",
    title: "UI Design Basics",
    description:
      "A hands-on introduction to layout, colour and typography. Bring a laptop; you will leave with a small interface you designed yourself.",
    date: "2026-10-13",
    time: "18:00",
    location: "Design Hub, Room 2",
    category: "Workshop",
    capacity: 30,
    booked: 27,
    remaining: 3,
    bookingPercentage: 90,
    status: "Almost full",
  },
  {
    id: "e2",
    title: "Jazz Under the Stars",
    description: "An open-air evening featuring live jazz performances with regional and international artists.",
    date: "2026-10-17",
    time: "20:00",
    location: "Riverside Amphitheatre",
    category: "Concert",
    capacity: 200,
    booked: 116,
    remaining: 84,
    bookingPercentage: 58,
    status: "Available",
  },
  {
    id: "e3",
    title: "Product Talks: Launch Day",
    description: "Keynote talks by startup founders and product leaders on building scalable web products.",
    date: "2026-10-15",
    time: "17:30",
    location: "Main Hall",
    category: "Talk",
    capacity: 120,
    booked: 120,
    remaining: 0,
    bookingPercentage: 100,
    status: "Full",
  },
  {
    id: "e4",
    title: "React & TypeScript Lab",
    description: "Deep dive into React state, effects, TypeScript patterns and performant rendering.",
    date: "2026-10-19",
    time: "10:00",
    location: "Lab 3",
    category: "Workshop",
    capacity: 25,
    booked: 11,
    remaining: 14,
    bookingPercentage: 44,
    status: "Available",
  },
  {
    id: "e5",
    title: "Photography Walk",
    description: "Morning street photography tour through old town alleys and architecture.",
    date: "2026-10-04",
    time: "09:00",
    location: "Old Town Square",
    category: "Meetup",
    capacity: 15,
    booked: 15,
    remaining: 0,
    bookingPercentage: 100,
    status: "Past",
  },
];

// In-memory active bookings list
const mockBookings: Booking[] = [
  {
    id: "b100",
    code: "EV-1024",
    eventId: "e1",
    event: { ...mockEvents[0] },
    customerName: "Rami Kabbani",
    customerPhone: "0944111222",
    places: 2,
    bookedAt: "2026-10-08T14:20:00.000Z",
    status: "Active",
    canCancel: true,
  },
];

function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}

function updateEventAvailability(event: EventItem): EventItem {
  const bookedCount = event.booked;
  const remaining = Math.max(0, event.capacity - bookedCount);
  const percentage = Math.round((bookedCount / event.capacity) * 100);

  const eventDate = new Date(`${event.date}T${event.time}:00`);
  const isPast = eventDate.getTime() <= Date.now() || event.status === "Past";

  let status = event.status;
  if (isPast) {
    status = "Past";
  } else if (remaining === 0) {
    status = "Full";
  } else if (percentage >= 90) {
    status = "Almost full";
  } else {
    status = "Available";
  }

  return {
    ...event,
    booked: bookedCount,
    remaining,
    bookingPercentage: percentage,
    status,
  };
}

/**
 * Mock implementation of GET /events/:id
 */
export async function mockGetEventById(id: string): Promise<EventItem> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const event = mockEvents.find((e) => e.id === id);
  if (!event) {
    const error: ApiError = { statusCode: 404, message: "Event not found" };
    throw error;
  }
  return updateEventAvailability(event);
}

/**
 * Mock implementation of POST /bookings
 * Enforces all checks in the exact order specified in API_CONTRACT.md section 3
 */
export async function mockCreateBooking(payload: {
  eventId: string;
  customerName: string;
  customerPhone: string;
  places: number;
}): Promise<Booking> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const { eventId, customerName, customerPhone, places } = payload;

  // 1. Validation checks
  if (!customerName || customerName.trim() === "") {
    const error: ApiError = { statusCode: 400, message: "Customer name is required" };
    throw error;
  }

  const cleanPhone = normalizePhone(customerPhone || "");
  if (!cleanPhone || cleanPhone.length < 6) {
    const error: ApiError = { statusCode: 400, message: "A valid phone number is required" };
    throw error;
  }

  if (
    typeof places !== "number" ||
    isNaN(places) ||
    places < 1 ||
    places > 4 ||
    !Number.isInteger(places)
  ) {
    const error: ApiError = {
      statusCode: 400,
      message: "Places must be a whole number between 1 and 4",
    };
    throw error;
  }

  // 2. Event exists check
  const eventIndex = mockEvents.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) {
    const error: ApiError = { statusCode: 404, message: "Event not found" };
    throw error;
  }

  const event = mockEvents[eventIndex];

  // 3. Event has started
  const eventDateTime = new Date(`${event.date}T${event.time}:00`);
  if (event.status === "Past" || eventDateTime.getTime() <= Date.now()) {
    const error: ApiError = {
      statusCode: 409,
      message: "This event has already started and can no longer be booked",
    };
    throw error;
  }

  // 4. Event is Full
  if (event.remaining <= 0 || event.status === "Full") {
    const error: ApiError = { statusCode: 409, message: "This event is full" };
    throw error;
  }

  // 5. More places than remain
  if (places > event.remaining) {
    const error: ApiError = {
      statusCode: 409,
      message: `Only ${event.remaining} places remain for this event`,
    };
    throw error;
  }

  // 6. Duplicate phone check for active booking
  const existingActive = mockBookings.find(
    (b) =>
      b.eventId === eventId &&
      b.status === "Active" &&
      normalizePhone(b.customerPhone) === cleanPhone
  );
  if (existingActive) {
    const error: ApiError = {
      statusCode: 409,
      message: "You already have an active booking for this event",
    };
    throw error;
  }

  // Deduct places and update event state
  event.booked += places;
  event.remaining = Math.max(0, event.capacity - event.booked);
  event.bookingPercentage = Math.round((event.booked / event.capacity) * 100);
  if (event.remaining === 0) {
    event.status = "Full";
  } else if (event.bookingPercentage >= 90) {
    event.status = "Almost full";
  } else {
    event.status = "Available";
  }

  // Create booking object
  const newBooking: Booking = {
    id: `b${Date.now()}`,
    code: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
    eventId: event.id,
    event: { ...event },
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    places,
    bookedAt: new Date().toISOString(),
    status: "Active",
    canCancel: true,
  };

  mockBookings.push(newBooking);
  return newBooking;
}
