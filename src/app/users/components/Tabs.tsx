import Link from "next/link";

export function Tabs({ id, tab }: { id: string; tab: "polls" | "votes" }) {
  return (
    <div className="flex flex-row gap-2">
      <Link
        href={`/users/${id}?tab=polls`}
        className={`text-bold pointer-events-auto w-full rounded-xl border border-neutral-800 px-3 py-2 md:pointer-events-none
          ${tab !== "votes" ? "flex" : "flex md:hidden"}
        `}
      >
        POLLS
      </Link>
      <Link
        href={`/users/${id}?tab=votes`}
        className={`text-bold pointer-events-auto w-full rounded-xl border border-neutral-800 px-3 py-2 md:pointer-events-none
          ${tab === "votes" ? "flex" : "flex md:hidden"}
        `}
      >
        VOTES
      </Link>
    </div>
  );
}
