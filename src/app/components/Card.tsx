import { twMerge } from "tailwind-merge";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex w-fit flex-grow flex-col gap-2 rounded-xl border border-neutral-800 px-3 py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
