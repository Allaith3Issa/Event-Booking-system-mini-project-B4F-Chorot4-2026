interface EventSummaryBannerProps {
  title: string;
  date: string;
  time: string;
  location: string;
  remaining: number;
}

export default function EventSummaryBanner({
  title,
  date,
  time,
  location,
  remaining,
}: EventSummaryBannerProps) {
  return (
    <div className="event-summary-banner">
      <h2 className="summary-title">{title}</h2>
      <p className="summary-meta">
        {date} &middot; {time} &middot; {location} &middot;{" "}
        <span className="places-left-tag">{remaining} places left</span>
      </p>
    </div>
  );
}
