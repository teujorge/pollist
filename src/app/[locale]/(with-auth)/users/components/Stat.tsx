import { formatNumber } from "@/lib/utils";

export function Stat({
  label,
  count,
  isShimmer = false,
}: {
  label: string;
  count: number;
  isShimmer?: boolean;
}) {
  const _count = formatNumber(count);

  return (
    <p className={isShimmer ? "shimmer text-transparent" : undefined}>
      <span className="font-bold">
        {_count}
        {isShimmer && "M"}{" "}
      </span>
      {label}
    </p>
  );
}
