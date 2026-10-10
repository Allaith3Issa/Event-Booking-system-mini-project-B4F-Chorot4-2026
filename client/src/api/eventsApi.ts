import { EventItem, ApiError } from "../types";
import { MOCK_EVENTS, MOCK_CATEGORIES } from "../mocks/eventsMock"; 


const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false"; 
const BASE_URL = "http://localhost:3000";


export interface GetEventsParams {
  category?: string;
  date?: string;          
  availableOnly?: boolean;
  includePast?: boolean;
}


export async function getEvents(params?: GetEventsParams): Promise<EventItem[]> {
  if (USE_MOCK) {
    
    await new Promise((resolve) => setTimeout(resolve, 200));
    let result = [...MOCK_EVENTS];

   
    if (!params?.includePast) {
      result = result.filter((e) => e.status !== "Past");
    }

   
    if (params?.category && params.category !== "All") {
      result = result.filter(
        (e) => e.category.toLowerCase() === params.category?.toLowerCase()
      );
    }

   
    if (params?.date) {
      result = result.filter((e) => e.date === params.date);
    }

   
    if (params?.availableOnly) {
      result = result.filter((e) => e.remaining > 0);
    }

    return result;
  }

  
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
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to fetch events");
  }
  
  return response.json();
}


export async function getEventCategories(): Promise<string[]> {
  if (USE_MOCK) {
    return MOCK_CATEGORIES;
  }

  const response = await fetch(`${BASE_URL}/events/categories`);
  
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to fetch categories");
  }
  
  return response.json();
}