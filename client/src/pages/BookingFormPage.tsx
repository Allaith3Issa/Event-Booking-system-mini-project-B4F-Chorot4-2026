import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EventItem } from "../types";
import { getEventById, createBooking } from "../api/bookingApi";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EventSummaryBanner from "../components/EventSummaryBanner";
import BookingForm from "../components/BookingForm";

export default function BookingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch event details on mount to guarantee fresh remaining availability
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

  const handleBookingSubmit = async (formData: {
    customerName: string;
    customerPhone: string;
    places: number;
  }) => {
    if (!event) return;
    setServerError(null);
    setIsSubmitting(true);

    try {
      const newBooking = await createBooking({
        eventId: event.id,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        places: formData.places,
      });

      // On success: Navigate to Confirmation screen with booking in location state
      navigate("/confirmation", { state: { booking: newBooking } });
    } catch (err: unknown) {
      // Show backend rejection message exactly as returned
      const errorObj = err as { message?: string };
      setServerError(errorObj?.message || "An error occurred while booking");
      // Re-fetch event to update remaining places on outdated screens
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
        <ErrorMessage
          message={pageError || "Event not found"}
          onRetry={loadEvent}
        />
        <div style={{ marginTop: "1rem" }}>
          <Link to="/" className="back-link">
            &larr; Back to events
          </Link>
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

        {/* Modular Selected Event Summary Component */}
        <EventSummaryBanner
          title={event.title}
          date={event.date}
          time={event.time}
          location={event.location}
          remaining={event.remaining}
        />

        {/* Backend rejection alert */}
        {serverError && (
          <div className="alert-box alert-error" role="alert">
            <p className="alert-message">{serverError}</p>
          </div>
        )}

        {/* Modular Booking Form Component */}
        <BookingForm
          remainingPlaces={event.remaining}
          isSubmitting={isSubmitting}
          onSubmit={handleBookingSubmit}
          onCancel={() => navigate(`/events/${event.id}`)}
        />
      </div>
    </div>
  );
}
