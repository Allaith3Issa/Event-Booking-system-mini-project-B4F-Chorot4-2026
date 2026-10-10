import type {Booking, ApiError} from "../types";

const BASE_URL = "http://localhost:3000";

export interface CreateBookingPayload {
  eventId: number;
  customerName: string;
  customerPhone: string;
  places: number;
}

export async function createBooking(
  data: CreateBookingPayload,
): Promise<Booking> {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create booking");
  }

  return response.json();
}

export async function findBooking(
  phone: string,
  code: string,
): Promise<Booking> {
  const queryParams = new URLSearchParams({phone, code});
  const response = await fetch(
    `${BASE_URL}/bookings/find?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    },
  );

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Booking not found.");
  }

  return response.json();
}

export async function cancelBooking(
  id: number | string,
  phone: string,
): Promise<Booking> {
  const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({phone}),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to cancel booking.");
  }

  return response.json();
}
