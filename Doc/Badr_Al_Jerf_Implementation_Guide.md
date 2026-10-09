# Badr Al Jerf — Event Details & Booking Implementation Guide
**Role**: Frontend Engineer (Team 4 · Weekly Mini Project 02)  
**Responsibilities**: Event Details Page (`/events/:id`) & Booking Form Page (`/events/:id/book`) — Flow B & Flow C  
**Authority**: Backend enforces all rules; Frontend guides the user and displays backend rejections verbatim.

---

## 1. Overview & Flow Mapping

### Your Deliverables
1. **Event Details Page (`/events/:id`)**: Shows event details, live availability summary (capacity, booked, remaining, bookingPercentage, status badge), loading/error/404 states, and the "Book places" button.
2. **Booking Form Page (`/events/:id/book`)**: Collects customer name, phone number, and places (1..4), provides inline validation, prevents duplicate/double-click submission, handles backend rejections, and redirects to the confirmation page.
3. **API Service (`src/api/bookingApi.ts`)**: Switches between mock and real API via `VITE_USE_MOCK`.
4. **Mock Store (`src/mocks/bookingMock.ts`)**: Accurately simulates the API Contract, including remaining computation and rejection scenarios.

---

## 2. Phase-by-Phase Implementation

### Phase 1: Mocks & API Contract Setup

#### File: `src/mocks/bookingMock.ts`
Matches the exact types defined in `src/types.ts` and `API-Contract.md`. It simulates server delay and enforces exact rejection messages and HTTP status codes (400, 404, 409).

```typescript
import { EventItem, Booking, ApiError } from "../types";

const mockEvents: EventItem[] = [
  {
    id: "e1",
    title: "UI Design Basics",
    description: "A hands-on introduction to layout, colour and typography. Bring a laptop; you will leave with a small interface you designed yourself.",
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

export async function mockGetEventById(id: string): Promise<EventItem> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const event = mockEvents.find((e) => e.id === id);
  if (!event) {
    const error: ApiError = { statusCode: 404, message: "Event not found" };
    throw error;
  }
  return updateEventAvailability(event);
}

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
    throw { statusCode: 400, message: "Customer name is required" } as ApiError;
  }
  const cleanPhone = normalizePhone(customerPhone || "");
  if (!cleanPhone || cleanPhone.length < 6) {
    throw { statusCode: 400, message: "A valid phone number is required" } as ApiError;
  }
  if (typeof places !== "number" || isNaN(places) || places < 1 || places > 4 || !Number.isInteger(places)) {
    throw { statusCode: 400, message: "Places must be a whole number between 1 and 4" } as ApiError;
  }

  // 2. Event exists
  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw { statusCode: 404, message: "Event not found" } as ApiError;
  }

  // 3. Event started
  const eventDateTime = new Date(`${event.date}T${event.time}:00`);
  if (event.status === "Past" || eventDateTime.getTime() <= Date.now()) {
    throw { statusCode: 409, message: "This event has already started and can no longer be booked" } as ApiError;
  }

  // 4. Event Full
  if (event.remaining <= 0 || event.status === "Full") {
    throw { statusCode: 409, message: "This event is full" } as ApiError;
  }

  // 5. More places than remain
  if (places > event.remaining) {
    throw { statusCode: 409, message: `Only ${event.remaining} places remain for this event` } as ApiError;
  }

  // 6. Duplicate active booking
  const existing = mockBookings.find(
    (b) => b.eventId === eventId && b.status === "Active" && normalizePhone(b.customerPhone) === cleanPhone
  );
  if (existing) {
    throw { statusCode: 409, message: "You already have an active booking for this event" } as ApiError;
  }

  // Update in-memory state
  event.booked += places;
  event.remaining = Math.max(0, event.capacity - event.booked);
  event.bookingPercentage = Math.round((event.booked / event.capacity) * 100);
  if (event.remaining === 0) event.status = "Full";
  else if (event.bookingPercentage >= 90) event.status = "Almost full";
  else event.status = "Available";

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
```

---

#### File: `src/api/bookingApi.ts`
Enables the single switch via `VITE_USE_MOCK`:

```typescript
import { EventItem, Booking, ApiError } from "../types";
import { mockGetEventById, mockCreateBooking } from "../mocks/bookingMock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.message || "Failed to create booking");
  }
  return data as Booking;
}
```

---

### Phase 2 & 3: Event Details Page (`/events/:id`)

#### File: `src/pages/EventDetailsPage.tsx`
- Fetches `getEventById(id)` on mount using `useParams`.
- Renders Title, Category tag, StatusBadge, Date, Time, Location, Description.
- Availability block: Capacity, Booked, Remaining (highlighted), Booked %.
- Progress bar bonus matching current status.
- Booking entry point: "Book places" button enabled only when event is not Full and not Past (`isBookable`). Otherwise disabled/hidden with informative text ("This event is full" or "This event has already started").
- 404 state displays "Event not found" with link back to events.

```tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { EventItem } from "../types";
import { getEventById } from "../api/bookingApi";
import StatusBadge from "../components/StatusBadge";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err: unknown) {
      const errorObj = err as { statusCode?: number; message?: string };
      if (errorObj?.statusCode === 404 || errorObj?.message?.toLowerCase().includes("not found")) {
        setNotFound(true);
      } else {
        setError(errorObj?.message || "Failed to load event details");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingMessage />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="page-container not-found-container">
        <h2>Event not found</h2>
        <p>The event you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-secondary">
          Back to events
        </Link>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container">
        <ErrorMessage message={error || "An unexpected error occurred"} onRetry={fetchEvent} />
        <div style={{ marginTop: "1rem" }}>
          <Link to="/" className="back-link">&larr; Back to events</Link>
        </div>
      </div>
    );
  }

  const isBookable = event.status !== "Full" && event.status !== "Past" && event.remaining > 0;

  return (
    <div className="page-container event-details-page">
      <div className="page-header">
        <Link to="/" className="back-link">&larr; Back to events</Link>
      </div>

      <article className="event-card-details">
        <div className="event-card-header">
          <div className="badge-row">
            <StatusBadge status={event.status} />
            <span className="category-tag">{event.category}</span>
          </div>
          <h1 className="event-title">{event.title}</h1>
        </div>

        <section className="event-info-grid">
          <div className="info-item">
            <span className="info-label">Date</span>
            <span className="info-value">{event.date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time</span>
            <span className="info-value">{event.time}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{event.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Category</span>
            <span className="info-value">{event.category}</span>
          </div>
        </section>

        <section className="about-section">
          <h2>About this event</h2>
          <p className="event-description">{event.description}</p>
        </section>

        <section className="availability-section">
          <h2>Availability</h2>
          <div className="availability-grid">
            <div className="availability-card">
              <span className="availability-label">Capacity</span>
              <span className="availability-number">{event.capacity}</span>
            </div>
            <div className="availability-card">
              <span className="availability-label">Booked</span>
              <span className="availability-number">{event.booked}</span>
            </div>
            <div className="availability-card">
              <span className="availability-label">Remaining</span>
              <span className="availability-number highlight">{event.remaining}</span>
            </div>
            <div className="availability-card">
              <span className="availability-label">Booked</span>
              <span className="availability-number">{event.bookingPercentage}%</span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className={`progress-bar-fill status-${event.status.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ width: `${Math.min(100, Math.max(0, event.bookingPercentage))}%` }}
            />
          </div>
        </section>

        <section className="booking-action-section">
          {isBookable ? (
            <div className="booking-allowed">
              <button
                className="btn-primary"
                onClick={() => navigate(`/events/${event.id}/book`)}
              >
                Book places
              </button>
              <p className="helper-text">1 to 4 places per booking</p>
            </div>
          ) : (
            <div className="booking-disabled-box">
              <button className="btn-disabled" disabled>
                Book places
              </button>
              <p className="disabled-notice">
                {event.status === "Full" || event.remaining === 0
                  ? "This event is full"
                  : "This event has already started"}
              </p>
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
```

---

### Phase 4 & 5: Booking Form Page (`/events/:id/book`)

#### File: `src/pages/BookingFormPage.tsx`
- Fetches the event on load to display fresh remaining count and event title/date.
- Controlled state for `customerName`, `customerPhone`, `places`.
- Frontend validation displaying inline errors beneath inputs:
  - Name: "Customer name is required"
  - Phone: "A valid phone number is required"
  - Places: "Places must be a whole number between 1 and 4" or "Only X places remain"
- Backend submission handling:
  - `isSubmitting` disables the submit button to block double clicks.
  - On rejection: displays the server error message verbatim in an alert banner while keeping inputs intact. Re-fetches the event to update available places.
  - On success: redirects to `/confirmation` with `{ state: { booking: newBooking } }`.

```tsx
import { useEffect, useState, useCallback, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EventItem } from "../types";
import { getEventById, createBooking } from "../api/bookingApi";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

interface FieldErrors {
  name?: string;
  phone?: string;
  places?: string;
}

export default function BookingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [places, setPlaces] = useState<number>(1);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadEvent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setPageError(null);
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setPageError(errorObj?.message || "Failed to load event for booking");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!customerName.trim()) {
      errors.name = "Customer name is required";
    }

    const cleanPhone = customerPhone.replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 6) {
      errors.phone = "A valid phone number is required";
    }

    const placesNum = Number(places);
    if (!placesNum || !Number.isInteger(placesNum) || placesNum < 1 || placesNum > 4) {
      errors.places = "Places must be a whole number between 1 and 4";
    } else if (event && placesNum > event.remaining) {
      errors.places = `Only ${event.remaining} places remain for this event`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!event) return;
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newBooking = await createBooking({
        eventId: event.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        places: Number(places),
      });

      navigate("/confirmation", { state: { booking: newBooking } });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setServerError(errorObj?.message || "An error occurred while booking");
      loadEvent();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingMessage />
      </div>
    );
  }

  if (pageError || !event) {
    return (
      <div className="page-container">
        <ErrorMessage message={pageError || "Event not found"} onRetry={loadEvent} />
        <div style={{ marginTop: "1rem" }}>
          <Link to="/" className="back-link">&larr; Back to events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container booking-form-page">
      <div className="page-header">
        <Link to={`/events/${event.id}`} className="back-link">
          &larr; Back to event details
        </Link>
      </div>

      <div className="form-wrapper">
        <h1 className="form-page-title">Book your places</h1>

        <div className="event-summary-banner">
          <h2 className="summary-title">{event.title}</h2>
          <p className="summary-meta">
            {event.date} &middot; {event.time} &middot; {event.location} &middot;{" "}
            <span className="places-left-tag">{event.remaining} places left</span>
          </p>
        </div>

        {serverError && (
          <div className="alert-box alert-error" role="alert">
            <p className="alert-message">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="booking-form">
          <div className="form-group">
            <label htmlFor="customerName" className="form-label">Full name</label>
            <input
              id="customerName"
              type="text"
              className={`form-input ${fieldErrors.name ? "input-error" : ""}`}
              placeholder="e.g. Sara Ahmad"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone" className="form-label">Phone number</label>
            <input
              id="customerPhone"
              type="tel"
              className={`form-input ${fieldErrors.phone ? "input-error" : ""}`}
              placeholder="e.g. 0933123456"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.phone && <span className="field-error-text">{fieldErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="places" className="form-label">Number of places</label>
            <input
              id="places"
              type="number"
              min={1}
              max={Math.min(4, Math.max(1, event.remaining))}
              className={`form-input ${fieldErrors.places ? "input-error" : ""}`}
              value={places}
              onChange={(e) => {
                setPlaces(Number(e.target.value));
                if (fieldErrors.places) setFieldErrors({ ...fieldErrors, places: undefined });
              }}
              disabled={isSubmitting}
            />
            <p className="form-hint">
              Up to 4 per booking. Only {event.remaining} {event.remaining === 1 ? "place remains" : "places remain"}.
            </p>
            {fieldErrors.places && <span className="field-error-text">{fieldErrors.places}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || event.remaining <= 0}
            >
              {isSubmitting ? "Confirming..." : "Confirm booking"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/events/${event.id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### Phase 6: Switching to the Real Backend
When backend developers (Majed & Adham) announce endpoints are ready:
1. Open `.env` (or set `client/.env`).
2. Set:
   ```env
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:3000
   ```
3. Test `GET /events/:id` and `POST /bookings` against the live NestJS server.
4. Verify error codes 400, 404, and 409 return `{ statusCode, message }` properly.

---

### Phase 7: Edge Cases & Demo Checklist for Presentation

| Edge Case | Test Step | Expected Behavior |
| :--- | :--- | :--- |
| **Invalid Name** | Leave full name empty | Inline error: `Customer name is required` |
| **Invalid Phone** | Enter `123` | Inline error: `A valid phone number is required` |
| **Places > 4 or < 1** | Enter `5` or `0` | Inline error: `Places must be a whole number between 1 and 4` |
| **Places > Remaining** | Event has 2 left, request 3 | Inline error / rejection: `Only 2 places remain for this event` |
| **Duplicate Booking** | Book with `0944111222` twice for same event | Server alert: `You already have an active booking for this event` |
| **Outdated Page** | Open form, book remaining places, submit | Server alert: `This event is full`, event refreshed |
| **Event Reaches Full** | Book last remaining places | Event status changes to `Full`, 0 remaining, Book button disabled |
| **Direct URL Refresh** | Hit browser reload on `/events/e1` or `/events/e1/book` | Screen fetches fresh data without blank screen or crash |
| **Double Click Prevention** | Click "Confirm booking" rapidly | Button disables and changes to "Confirming...", only one request sent |
