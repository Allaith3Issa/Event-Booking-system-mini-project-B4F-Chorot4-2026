import {useState} from "react";
import type {FormEvent} from "react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import StatusBadge from "../components/StatusBadge";
import {cancelBooking, findBooking} from "../api/manageApi";
import type {Booking} from "../types";

export default function ManageBookingPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBooking(null);
    setError("");
    setMessage("");
    setIsSearching(true);

    try {
      const result = await findBooking(phone.trim(), code.trim());
      setBooking(result);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Unable to find this booking",
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCancel() {
    if (
      !booking ||
      !window.confirm(
        `Cancel this booking and return ${booking.places} places?`,
      )
    ) {
      return;
    }

    setError("");
    setMessage("");
    setIsCancelling(true);

    try {
      const cancelledBooking = await cancelBooking(booking.id, phone.trim());
      setBooking(cancelledBooking);
      setMessage(
        `Booking cancelled. ${cancelledBooking.places} place${cancelledBooking.places === 1 ? "" : "s"} returned to the event.`,
      );
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this booking",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <section className="manage-booking">
      <header className="page-heading">
        <p className="eyebrow">Your tickets</p>
        <h1>Find or manage a booking</h1>
        <p>Enter the phone number and booking code used when you booked.</p>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <label>
          Phone number
          <input
            autoComplete="tel"
            name="phone"
            onChange={(event) => setPhone(event.target.value)}
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
            onChange={(event) => setCode(event.target.value)}
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
              onClick={handleCancel}
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
