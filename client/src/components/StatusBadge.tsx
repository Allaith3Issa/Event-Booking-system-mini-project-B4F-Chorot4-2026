interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = status.replace(/\s+/g, "-");
  return (
    <span className={`status-badge status-badge--${cls}`}>
      {status}
    </span>
  );
}