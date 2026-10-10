import { EventStatus } from "../types";

interface EventAvailabilityProps {
  capacity: number;
  booked: number;
  remaining: number;
  bookingPercentage: number;
  status: EventStatus;
}

export default function EventAvailability({
  capacity,
  booked,
  remaining,
  bookingPercentage,
  status,
}: EventAvailabilityProps) {
  return (
    <section className="availability-section">
      <h2>Availability</h2>

      <div className="availability-grid">
        <div className="availability-card">
          <span className="availability-label">Capacity</span>
          <span className="availability-number">{capacity}</span>
        </div>
        <div className="availability-card">
          <span className="availability-label">Booked</span>
          <span className="availability-number">{booked}</span>
        </div>
        <div className="availability-card">
          <span className="availability-label">Remaining</span>
          <span className="availability-number highlight">{remaining}</span>
        </div>
        <div className="availability-card">
          <span className="availability-label">Booked</span>
          <span className="availability-number">{bookingPercentage}%</span>
        </div>
      </div>

      {/* Bonus: Progress bar */}
      <div className="progress-bar-container">
        <div
          className={`progress-bar-fill status-${status.toLowerCase().replace(/\s+/g, "-")}`}
          style={{ width: `${Math.min(100, Math.max(0, bookingPercentage))}%` }}
        />
      </div>
    </section>
  );
}
