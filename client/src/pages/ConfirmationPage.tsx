import {useLocation, Link, useNavigate} from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

interface BookingConfirmationState {
  booking?: {
    bookingCode: string;
    customerName: string;
    customerPhone: string;
    placesCount: number;
    bookingDate: string;
    status: string;
    event: {
      id: string;
      title: string;
      date: string;
      time: string;
      location: string;
      remainingPlaces: number;
      status: string;
    };
  };
}

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BookingConfirmationState;
  const booking = state?.booking;

  // If the page was refreshed and there is no booking state in router
  if (!booking) {
    return (
      <div className="confirmation-container">
        <div className="message error-message">
          <h2>No Booking Details Found</h2>
          <p>
            It seems the page was refreshed or no booking session is available.
          </p>
          <div className="actions">
            <Link to="/manage" className="btn-primary">
              Go to Find / Manage Booking
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-header">
          <h2>Booking Confirmed Successfully!</h2>
          <div className="booking-code-box">
            <span>Booking Code:</span>
            <strong className="code-highlight">{booking.bookingCode}</strong>
          </div>
        </div>

        <div className="details-section">
          <h3>Event Information</h3>
          <p>
            <strong>Title:</strong> {booking.event.title}
          </p>
          <p>
            <strong>Date & Time:</strong> {booking.event.date} |{" "}
            {booking.event.time}
          </p>
          <p>
            <strong>Location:</strong> {booking.event.location}
          </p>
          <p>
            <strong>Remaining Places:</strong> {booking.event.remainingPlaces}{" "}
            (Event Status: <StatusBadge status={booking.event.status} />)
          </p>
        </div>

        <div className="details-section">
          <h3>Customer & Booking Details</h3>
          <p>
            <strong>Customer Name:</strong> {booking.customerName}
          </p>
          <p>
            <strong>Phone Number:</strong> {booking.customerPhone}
          </p>
          <p>
            <strong>Places Booked:</strong> {booking.placesCount}
          </p>
          <p>
            <strong>Booking Date:</strong>{" "}
            {new Date(booking.bookingDate).toLocaleString()}
          </p>
          <p>
            <strong>Booking Status:</strong>{" "}
            <StatusBadge status={booking.status} />
          </p>
        </div>

        <div className="actions-footer">
          <Link to="/" className="btn-primary">
            Back to Events
          </Link>
          <button onClick={() => navigate("/manage")} className="btn-secondary">
            Find / Manage Booking
          </button>
        </div>
      </div>
    </div>
  );
}
