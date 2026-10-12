import type {Booking} from "../types";
import StatusBadge from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  isCancelling: boolean;
  onCancel: () => void;
}

function BookingCard({booking, isCancelling, onCancel}: BookingCardProps) {
  return (
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
          type="button"
          onClick={onCancel}
          disabled={isCancelling}
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
  );
}

export default BookingCard;
