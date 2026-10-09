import { EventItem, Booking, ApiError } from "../types";
import { mockGetEventById, mockCreateBooking } from "../mocks/bookingMock";

// Check environment flag for mock mode (default is true for development)
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetch event details by ID.
 * Returns EventItem or throws an Error with the readable message.
 */
export async function getEventById(id: string): Promise<EventItem> {
  if (USE_MOCK) {
    return mockGetEventById(id);
  }

  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.message || "Failed to fetch event details");
  }

  return data as EventItem;
}

/**
 * Submit a new booking request.
 * Returns the created Booking or throws an Error with the exact server message.
 */
export async function createBooking(payload: {
  eventId: string;
  customerName: string;
  customerPhone: string;
  places: number;
}): Promise<Booking> {
  if (USE_MOCK) {
    return mockCreateBooking(payload);
  }

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.message || "Failed to create booking");
  }

  return data as Booking;
}
