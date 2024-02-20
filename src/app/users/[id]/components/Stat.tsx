export function Stat({
  label,
  count,
  isShimmer = false,
}: {
  label: string;
  count: number;
  isShimmer?: boolean;
}) {
  return (
    <p className={isShimmer ? "shimmer text-transparent" : undefined}>
      <span className="font-bold">{count} </span>
      <span> {label}</span>
    </p>
  );
}
