import {EventItem, ApiError} from "../types";

const BASE_URL = "http://localhost:3000";

export interface GetEventsParams {
  category?: string;
  date?: string;
  availableOnly?: boolean;
  includePast?: boolean;
}

export async function getEvents(
  params?: GetEventsParams,
): Promise<EventItem[]> {
  const queryParams = new URLSearchParams();

  if (params?.category && params.category !== "All") {
    queryParams.append("category", params.category);
  }
  if (params?.date) {
    queryParams.append("date", params.date);
  }
  if (params?.availableOnly) {
    queryParams.append("availableOnly", "true");
  }
  if (params?.includePast) {
    queryParams.append("includePast", "true");
  }

  const response = await fetch(`${BASE_URL}/events?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch events");
  }

  return response.json();
}

export async function getEventById(id: string | number): Promise<EventItem> {
  const response = await fetch(`${BASE_URL}/events/${id}`);

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Event not found");
  }

  return response.json();
}

export async function getEventCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/events?includePast=true`);
    if (!response.ok) throw new Error();

    const events: EventItem[] = await response.json();
    return Array.from(new Set(events.map((e) => e.category)));
  } catch (error) {
    console.log(error);
    
    return ["Workshop", "Talk", "Concert", "Sports", "Meetup"];
  }
}
