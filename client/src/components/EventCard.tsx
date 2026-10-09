import { Link } from "react-router-dom";
import type { EventItem } from "../types";


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
  const isFull = event.remaining === 0;

  return (
    <div className={`event-card ${isPast ? "event-card--past" : ""}`}>
      <div className="event-card__top">
        <span className="event-card__category">{event.category}</span>
        <span className={`status-badge status-badge--${event.status}`}>
          {event.status}
        </span>
      </div>

      <h3 className="event-card__title">{event.title}</h3>

      <p className="event-card__meta">
        {formatDate(event.date, event.time)}
      </p>
      <p className="event-card__meta">{event.location}</p>

      <p className="event-card__places">
        {isFull ? "Full" : `${event.remaining} places left`}
      </p>

      <Link to={`/events/${event.id}`} className="event-card__link">
        {isPast ? "View details" : "View details & book"}
      </Link>
    </div>
  );
}