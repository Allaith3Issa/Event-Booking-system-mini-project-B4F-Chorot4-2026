import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { EventItem } from "../types";
import { getEventById } from "../api/bookingApi";
import StatusBadge from "../components/StatusBadge";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EventAvailability from "../components/EventAvailability";
import BookingActionButton from "../components/BookingActionButton";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();

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
      if (
        errorObj?.statusCode === 404 ||
        errorObj?.message?.toLowerCase().includes("not found")
      ) {
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
        <ErrorMessage
          message={error || "An unexpected error occurred"}
          onRetry={fetchEvent}
        />
        <div style={{ marginTop: "1rem" }}>
          <Link to="/" className="back-link">
            &larr; Back to events
          </Link>
        </div>
      </div>
    );
  }

  const isBookable =
    event.status !== "Full" && event.status !== "Past" && event.remaining > 0;

  return (
    <div className="page-container event-details-page">
      <div className="page-header">
        <Link to="/" className="back-link">
          &larr; Back to events
        </Link>
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

        {/* Modular Availability Summary & Progress Bar Component */}
        <EventAvailability
          capacity={event.capacity}
          booked={event.booked}
          remaining={event.remaining}
          bookingPercentage={event.bookingPercentage}
          status={event.status}
        />

        {/* Modular Booking Action Button Component */}
        <BookingActionButton
          eventId={event.id}
          isBookable={isBookable}
          status={event.status}
          remaining={event.remaining}
        />
      </article>
    </div>
  );
}
