# Event Booking: API Contract (v1)
 
Team 4 · Weekly Mini Project 02 · Owner: Allaith Issa
 
This file is the single agreement between frontend and backend.
Backend builds responses in exactly this shape. Frontend builds screens on mock data in exactly this shape.
**Do not change a field name without telling the team leader.**
 
Base URL: `http://localhost:3000` (backend) · Frontend runs on its own port (CORS enabled by backend).
 
---
 
## 1. Shared Types (copy to `types.ts` in the frontend, and to the backend types)
 
```ts
export type EventStatus = "Available" | "Almost full" | "Full" | "Past";
export type BookingStatus = "Active" | "Cancelled";
 
export interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;          // URL of the event image; placeholder until real images are ready
  date: string;              // "YYYY-MM-DD"
  time: string;              // "HH:mm" (24h)
  location: string;
  category: string;          // Workshop | Talk | Concert | Sports | Meetup ...
  capacity: number;
  booked: number;            // computed from Active bookings only
  remaining: number;         // capacity - booked
  bookingPercentage: number; // whole number 0..100
  status: EventStatus;
}
 
export interface Booking {
  id: string;
  code: string;              // "EV-2093"
  eventId: string;
  event: EventItem;          // with UPDATED availability
  customerName: string;
  customerPhone: string;
  places: number;            // 1..4
  bookedAt: string;          // ISO date-time
  status: BookingStatus;
  canCancel: boolean;        // computed by backend: Active AND event not started
}
 
export interface ApiError {
  statusCode: number;
  message: string;           // one readable sentence, ready to display
}
```
 
Rules: `booked` and `remaining` are never stored, always computed. `booked + remaining = capacity` always.
Status check order: Past, then Full, then Almost full (90%+), otherwise Available.
 
---
 
## 2. Events (owner: Majed)
 
### GET /events
 
Query (all optional, combinable): `category`, `date` (YYYY-MM-DD), `availableOnly=true`, `includePast=true`.
Default: upcoming only, sorted by date then time.
 
`200 OK`
```json
[
  {
    "id": "e3",
    "title": "UI Design Basics",
    "description": "A hands-on introduction to interface design.",
    "imageUrl": "http://localhost:3000/assets/images/placeholder.jpg",
    "date": "2026-10-15",
    "time": "18:00",
    "location": "Innovation Hub, Hall B",
    "category": "Workshop",
    "capacity": 30,
    "booked": 27,
    "remaining": 3,
    "bookingPercentage": 90,
    "status": "Almost full"
  }
]
```
No match: `200 OK` with `[]` (empty list is not an error).
 
Invalid date: `400`
```json
{ "statusCode": 400, "message": "Date must be in YYYY-MM-DD format" }
```
 
### GET /events/categories
 
`200 OK`
```json
["Workshop", "Talk", "Concert", "Sports", "Meetup"]
```
 
### GET /events/:id
 
`200 OK`: one `EventItem` (same shape as above).
 
Not found: `404`
```json
{ "statusCode": 404, "message": "Event not found" }
```
 
---
 
## 3. Bookings (owner: Adham)
 
### POST /bookings
 
Request
```json
{
  "eventId": "e3",
  "customerName": "Sara Ahmad",
  "customerPhone": "0933123456",
  "places": 2
}
```
 
`201 Created`
```json
{
  "id": "b101",
  "code": "EV-2093",
  "eventId": "e3",
  "event": {
    "id": "e3", "title": "UI Design Basics", "description": "...",
    "imageUrl": "http://localhost:3000/assets/images/placeholder.jpg",
    "date": "2026-10-15", "time": "18:00", "location": "Innovation Hub, Hall B",
    "category": "Workshop", "capacity": 30,
    "booked": 29, "remaining": 1, "bookingPercentage": 97, "status": "Almost full"
  },
  "customerName": "Sara Ahmad",
  "customerPhone": "0933123456",
  "places": 2,
  "bookedAt": "2026-10-09T10:30:00.000Z",
  "status": "Active",
  "canCancel": true
}
```
 
Order of checks and the exact errors:
 
| # | Situation | Status | message |
|---|-----------|--------|---------|
| 1 | Name missing or empty | 400 | `Customer name is required` |
| 1 | Phone missing or invalid | 400 | `A valid phone number is required` |
| 1 | places is 0, negative, above 4, decimal, or not a number | 400 | `Places must be a whole number between 1 and 4` |
| 2 | Event does not exist | 404 | `Event not found` |
| 3 | Event has started | 409 | `This event has already started and can no longer be booked` |
| 4 | Event is Full | 409 | `This event is full` |
| 5 | More places than remain | 409 | `Only 2 places remain for this event` (real number) |
| 6 | Same phone has an Active booking for this event | 409 | `You already have an active booking for this event` |
 
### POST /bookings/find
 
Request
```json
{ "phone": "0933123456", "code": "EV-2093" }
```
`200 OK`: a `Booking` (same shape as above, with current `status` and `canCancel`).
 
Both values must match the same booking. Otherwise `404`
```json
{ "statusCode": 404, "message": "Booking not found. Check your phone number and booking code" }
```
 
### POST /bookings/:id/cancel
 
Request
```json
{ "phone": "0933123456" }
```
`200 OK`: the `Booking` with `"status": "Cancelled"`, `"canCancel": false`, and `event` showing the places returned.
 
| Situation | Status | message |
|-----------|--------|---------|
| Booking does not exist, or phone does not match | 404 | `Booking not found` |
| Already cancelled | 409 | `This booking is already cancelled` |
| Event has started | 409 | `This booking can no longer be cancelled because the event has started` |
 
---
 
## 4. Rules Everyone Follows
 
1. Every failure returns `{ statusCode, message }`. Frontend shows `message` as is.
2. All business rules are enforced in the backend. Frontend validation is only for convenience.
3. The frontend shows the Cancel button only when `canCancel` is true.
4. Phone numbers are compared after removing spaces and dashes.
5. Codes are compared case-insensitively.
6. After any booking or cancellation, every screen must re-fetch, never trust old data.
---
 
## 5. How to Work in Parallel (no waiting)
 
**Frontend (Taima, Badr, Yousef):**
- Build your screen on mock data that matches the types above. Keep your mock in your own file, for example `src/mocks/eventsMock.ts`.
- Call the backend through functions in your own api file (Taima: events, Badr: event by id and create booking, Yousef: find and cancel). Each function has a mock version and a real version.
- A single switch in `.env` (`VITE_USE_MOCK=true`) selects mock or real. When the backend is ready, set it to `false` and test your screen.
**Backend (Majed, Adham):**
- Build to the shapes above. Majed writes the seed and `computeAvailability(event, bookings, now)` as plain functions. Adham starts from a stub with the same signature and swaps in Majed's real one when ready.
- Test with Postman or curl against the examples in this file.
**Integration:** as soon as each endpoint is ready, its owner posts in the group chat. The matching frontend person switches that call from mock to real.
