import type {Booking, ApiError} from "../types";

const BASE_URL = "http://localhost:3000";

export async function findBooking(
  phone: string,
  code: string,
): Promise<Booking> {
  const queryParams = new URLSearchParams({
    phone: phone,
    code: code,
  });

  const response = await fetch(
    `${BASE_URL}/bookings/find?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Failed to find booking. Please check your details.",
    );
  }

  return response.json();
}

export async function cancelBooking(
  id: number | string,
  phone: string,
): Promise<Booking> {
  const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({phone}),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        "Failed to cancel booking. It might already be cancelled or the event has started.",
    );
  }

  return response.json();
}
