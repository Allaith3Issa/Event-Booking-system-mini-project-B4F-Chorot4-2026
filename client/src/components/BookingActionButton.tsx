import { useNavigate } from "react-router-dom";
import { EventStatus } from "../types";

interface BookingActionButtonProps {
  eventId: number;
  isBookable: boolean;
  status: EventStatus;
  remaining: number;
}

export default function BookingActionButton({
  eventId,
  isBookable,
  status,
  remaining,
}: BookingActionButtonProps) {
  const navigate = useNavigate();

  return (
    <section className="booking-action-section">
      {isBookable ? (
        <div className="booking-allowed">
          <button
            className="btn-primary"
            onClick={() => navigate(`/events/${eventId}/book`)}
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
            {status === "Full" || remaining === 0
              ? "This event is full"
              : "This event has already started"}
          </p>
        </div>
      )}
    </section>
  );
}
