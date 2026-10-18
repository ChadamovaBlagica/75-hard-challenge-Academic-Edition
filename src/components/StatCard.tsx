
type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export default function StatCard({
  label,
  value,
  detail,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="eyebrow">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="muted">{detail}</p>
    </article>
  );
}
