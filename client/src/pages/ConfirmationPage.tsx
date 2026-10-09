import { useLocation, Link } from "react-router-dom";
import { Booking } from "../types";
import StatusBadge from "../components/StatusBadge";

export default function ConfirmationPage() {
  const location = useLocation();
  const booking = (location.state as { booking?: Booking })?.booking;

  if (!booking) {
    return (
      <div className="page-container confirmation-page">
        <h2>No booking found</h2>
        <p>If you recently completed a booking, you can find it using your phone number and code.</p>
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Link to="/" className="btn-secondary">
            Back to events
          </Link>
          <Link to="/manage" className="btn-primary">
            Manage booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <span className="success-icon">&#10003;</span>
          <h1>Booking confirmed</h1>
          <p className="confirmation-subtext">
            Keep your code. You need it with your phone number to find or cancel this booking.
          </p>
        </div>

        <div className="confirmation-details-box">
          <div className="confirm-row highlight-code-row">
            <span className="confirm-label">Booking code</span>
            <span className="confirm-code">{booking.code}</span>
          </div>

          <div className="confirm-row">
            <span className="confirm-label">Event</span>
            <span className="confirm-value">{booking.event.title}</span>
          </div>

          <div className="confirm-row">
            <span className="confirm-label">Date and time</span>
            <span className="confirm-value">
              {booking.event.date} &middot; {booking.event.time}
            </span>
          </div>

          <div className="confirm-row">
            <span className="confirm-label">Location</span>
            <span className="confirm-value">{booking.event.location}</span>
          </div>

          <div className="confirm-row">
            <span className="confirm-label">Customer</span>
            <span className="confirm-value">{booking.customerName}</span>
          </div>

          <div className="confirm-row">
            <span className="confirm-label">Places</span>
            <span className="confirm-value">{booking.places}</span>
          </div>

          <div className="confirm-row">
            <span className="confirm-label">Status</span>
            <span className="confirm-value">
              <StatusBadge status={booking.status} />
            </span>
          </div>
        </div>

        <div className="confirmation-footer-notice">
          <p>
            {booking.event.remaining}{" "}
            {booking.event.remaining === 1 ? "place now remains" : "places now remain"} for this event.
          </p>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="btn-secondary">
            Back to events
          </Link>
          <Link to="/manage" className="btn-primary">
            Manage booking
          </Link>
        </div>
      </div>
    </div>
  );
}
