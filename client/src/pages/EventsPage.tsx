import { useEffect, useState } from "react";
import type { EventItem, ApiError } from "../types";
import { getEvents, getEventCategories } from "../api/eventsApi";
import { EventCard } from "../components/EventCard";
import { FiltersBar } from "../components/FiltersBar";
import type { Filters } from "../components/FiltersBar";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<EventItem[]>([]);
  const [past, setPast] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [filters, setFilters] = useState<Filters>({
    category: "",
    date: "",
    availableOnly: false,
  });

  const [showPast, setShowPast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEvents({
        category: filters.category || undefined,
        date: filters.date || undefined,
        availableOnly: filters.availableOnly || undefined,
        includePast: showPast || undefined,
      });

      setUpcoming(data.filter((e) => e.status !== "Past"));
      setPast(showPast ? data.filter((e) => e.status === "Past") : []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchEvents();
   
  }, [filters, showPast]);

  
  const hasActiveFilters = !!(
    filters.category ||
    filters.date ||
    filters.availableOnly
  );

  const clearFilters = () => {
    setFilters({ category: "", date: "", availableOnly: false });
  };

  const retry = () => {
    fetchEvents();
  };

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="events-hero__inner">
          <h1>Upcoming Events</h1>
          <p className="events-page__subtitle">
            Pick an event, see how many places are left, and book in under a minute.
          </p>
        </div>

        <div className="events-hero__filters">
          <FiltersBar
            categories={categories}
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
          />
        </div>
      </section>

      <div className="events-content">
        <label className="past-toggle">
          <input
            type="checkbox"
            checked={showPast}
            onChange={(e) => setShowPast(e.target.checked)}
          />
          Show past events
        </label>

        {loading && <LoadingMessage />}

        {error && !loading && (
          <ErrorMessage message={error.message} onRetry={retry} />
        )}

        {!loading && !error && upcoming.length === 0 && (
          <div className="empty-state">
            <p>
              {hasActiveFilters
                ? "No events match your filters"
                : "No upcoming events"}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        )}

        {!loading && !error && upcoming.length > 0 && (
          <>
            <p className="events-page__count">
              Showing {upcoming.length} events
            </p>
            <div className="events-grid">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}

        {showPast && past.length > 0 && (
          <section className="past-section">
            <h2>Past events</h2>
            <div className="events-grid">
              {past.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}