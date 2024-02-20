export function Stat({ count, label }: { count: number; label: string }) {
  return (
    <p>
      <span className="font-bold">{count} </span>
      <span>{label}</span>
    </p>
  );
}
