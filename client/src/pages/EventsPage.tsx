import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

export default function EventsPage() {
  const events = [
    {
      id: "e1",
      title: "UI Design Basics",
      category: "Workshop",
      date: "Tue 13 Oct",
      time: "18:00",
      location: "Design Hub, Room 2",
      placesText: "3 of 30 places left · 90% booked",
      status: "Almost full",
    },
    {
      id: "e2",
      title: "Jazz Under the Stars",
      category: "Concert",
      date: "Sat 17 Oct",
      time: "20:00",
      location: "Riverside Amphitheatre",
      placesText: "84 of 200 places left · 58% booked",
      status: "Available",
    },
    {
      id: "e3",
      title: "Product Talks: Launch Day",
      category: "Talk",
      date: "Thu 15 Oct",
      time: "17:30",
      location: "Main Hall",
      placesText: "0 of 120 places left · 100% booked",
      status: "Full",
    },
    {
      id: "e4",
      title: "React & TypeScript Lab",
      category: "Workshop",
      date: "Mon 19 Oct",
      time: "10:00",
      location: "Lab 3",
      placesText: "14 of 25 places left · 44% booked",
      status: "Available",
    },
    {
      id: "e5",
      title: "Photography Walk",
      category: "Meetup",
      date: "Sun 4 Oct",
      time: "09:00",
      location: "Old Town",
      placesText: "Booking closed",
      status: "Past",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Upcoming events</h1>
        <p className="page-subtitle">
          Pick an event, see how many places are left, and book in under a minute.
        </p>
      </div>

      <div className="events-grid">
        {events.map((evt) => (
          <Link to={`/events/${evt.id}`} key={evt.id} className="event-card-item">
            <div className="event-card-top">
              <StatusBadge status={evt.status} />
              <span className="category-tag">{evt.category}</span>
            </div>
            <h3 className="event-card-title">{evt.title}</h3>
            <p className="event-meta">
              {evt.date} &middot; {evt.time} &middot; {evt.location}
            </p>
            <p className="event-places">{evt.placesText}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
