import { Link } from "react-router-dom";
import type { EventItem } from "../types";
import StatusBadge from "./StatusBadge";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateStr: string, timeStr: string): string {
  const date = new Date(`${dateStr}T${timeStr}:00`);
  if (isNaN(date.getTime())) return `${dateStr} - ${timeStr}`;
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} - ${timeStr}`;
}

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const isPast = event.status === "Past";
  const statusClass = event.status.replace(/\s+/g, "-");

  return (
    <div className={`event-card ${isPast ? "event-card--past" : ""}`}>
     
      <div className="event-card__top">
        <StatusBadge status={event.status} />
        <span className="event-card__category">{event.category}</span>
      </div>

    
      <h3 className="event-card__title">{event.title}</h3>

     
      <p className="event-card__meta">
        {formatDate(event.date, event.time)} · {event.location}
      </p>

     
      <div className="event-card__progress">
        <div
          className={`event-card__progress-fill event-card__progress-fill--${statusClass}`}
          style={{ width: `${event.bookingPercentage}%` }}
        />
      </div>

     
      <p className="event-card__places">
        {event.remaining} of {event.capacity} places left ·{" "}
        {event.bookingPercentage}% booked
      </p>

   
      <Link to={`/events/${event.id}`} className="event-card__link">
        {isPast ? "View details" : "View details & book"}
      </Link>
    </div>
  );
}