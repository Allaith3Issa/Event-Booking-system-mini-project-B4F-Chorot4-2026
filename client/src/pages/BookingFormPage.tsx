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

  // Form input fields
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [places, setPlaces] = useState<number>(1);

  // Form states & feedback
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    if (
      !placesNum ||
      !Number.isInteger(placesNum) ||
      placesNum < 1 ||
      placesNum > 4
    ) {
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

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newBooking = await createBooking({
        eventId: event.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        places: Number(places),
      });

      // On success: Navigate to Confirmation screen with booking in location state
      navigate("/confirmation", { state: { booking: newBooking } });
    } catch (err: unknown) {
      // Show backend rejection message exactly as returned, keeping user inputs
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

        {/* Selected event summary */}
        <div className="event-summary-banner">
          <h2 className="summary-title">{event.title}</h2>
          <p className="summary-meta">
            {event.date} &middot; {event.time} &middot; {event.location}{" "}
            &middot;{" "}
            <span className="places-left-tag">
              {event.remaining} places left
            </span>
          </p>
        </div>

        {/* Backend rejection alert */}
        {serverError && (
          <div className="alert-box alert-error" role="alert">
            <p className="alert-message">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="booking-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="customerName" className="form-label">
              Full name
            </label>
            <input
              id="customerName"
              type="text"
              className={`form-input ${fieldErrors.name ? "input-error" : ""}`}
              placeholder="e.g. Sara Ahmad"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (fieldErrors.name)
                  setFieldErrors({ ...fieldErrors, name: undefined });
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.name && (
              <span className="field-error-text">{fieldErrors.name}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="customerPhone" className="form-label">
              Phone number
            </label>
            <input
              id="customerPhone"
              type="tel"
              className={`form-input ${fieldErrors.phone ? "input-error" : ""}`}
              placeholder="e.g. 0933123456"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                if (fieldErrors.phone)
                  setFieldErrors({ ...fieldErrors, phone: undefined });
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.phone && (
              <span className="field-error-text">{fieldErrors.phone}</span>
            )}
          </div>

          {/* Number of Places */}
          <div className="form-group">
            <label htmlFor="places" className="form-label">
              Number of places
            </label>
            <input
              id="places"
              type="number"
              min={1}
              max={Math.min(4, Math.max(1, event.remaining))}
              className={`form-input ${fieldErrors.places ? "input-error" : ""}`}
              value={places}
              onChange={(e) => {
                setPlaces(Number(e.target.value));
                if (fieldErrors.places)
                  setFieldErrors({ ...fieldErrors, places: undefined });
              }}
              disabled={isSubmitting}
            />
            <p className="form-hint">
              Up to 4 per booking. Only {event.remaining}{" "}
              {event.remaining === 1 ? "place remains" : "places remain"}.
            </p>
            {fieldErrors.places && (
              <span className="field-error-text">{fieldErrors.places}</span>
            )}
          </div>

          {/* Form Actions */}
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
