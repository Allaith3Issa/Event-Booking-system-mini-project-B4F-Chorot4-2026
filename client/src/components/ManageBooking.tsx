import type {FormEvent} from "react";
import ErrorMessage from "./ErrorMessage";
import LoadingMessage from "./LoadingMessage";
import StatusBadge from "./StatusBadge";
import type {Booking} from "../types";

interface ManageBookingProps {
  booking: Booking | null;
  code: string;
  error: string;
  isCancelling: boolean;
  isSearching: boolean;
  message: string;
  onCancel: () => void;
  onCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  phone: string;
}

export default function ManageBooking({
  booking,
  code,
  error,
  isCancelling,
  isSearching,
  message,
  onCancel,
  onCodeChange,
  onPhoneChange,
  onSearch,
  phone,
}: ManageBookingProps) {
  return (
    <section className="manage-booking">
      <header className="page-heading">
        <p className="eyebrow">Your tickets</p>
        <h1>Find or manage a booking</h1>
        <p>Enter the phone number and booking code used when you booked.</p>
      </header>

      <form className="search-form" onSubmit={onSearch}>
        <label>
          Phone number
          <input
            autoComplete="tel"
            name="phone"
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="0933123456"
            required
            type="tel"
            value={phone}
          />
        </label>
        <label>
          Booking code
          <input
            autoCapitalize="characters"
            autoComplete="off"
            name="code"
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="EV-2093"
            required
            type="text"
            value={code}
          />
        </label>
        <button className="primary-button" disabled={isSearching} type="submit">
          {isSearching ? "Searching..." : "Find booking"}
        </button>
      </form>

      {isSearching && <LoadingMessage />}
      {error && <ErrorMessage message={error} />}
      {message && (
        <p className="success-message" role="status">
          {message}
        </p>
      )}

      {booking && (
        <article className="booking-card" aria-live="polite">
          <div className="booking-card-heading">
            <div>
              <p className="eyebrow">Booking code</p>
              <h2>{booking.code}</h2>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <h3>{booking.event.title}</h3>
          <dl className="booking-details">
            <div>
              <dt>Date</dt>
              <dd>{booking.event.date}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{booking.event.time}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{booking.event.location}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{booking.customerName}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{booking.customerPhone}</dd>
            </div>
            <div>
              <dt>Places</dt>
              <dd>{booking.places}</dd>
            </div>
            <div>
              <dt>Booked on</dt>
              <dd>{new Date(booking.bookedAt).toLocaleString()}</dd>
            </div>
          </dl>

          {booking.canCancel ? (
            <button
              className="cancel-button"
              disabled={isCancelling}
              onClick={onCancel}
              type="button"
            >
              {isCancelling ? "Cancelling..." : "Cancel booking"}
            </button>
          ) : (
            <p className="cancel-note">
              {booking.status === "Cancelled"
                ? "This booking is already cancelled."
                : "This event has already started, so the booking can no longer be cancelled."}
            </p>
          )}
        </article>
      )}
    </section>
  );
}
