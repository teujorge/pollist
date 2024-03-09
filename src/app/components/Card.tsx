import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-accent flex w-fit flex-grow flex-col gap-2 rounded-xl border px-3 py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
