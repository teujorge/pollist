"use client";

import { PollCard } from "../PollCard/PollCard";
import { useInfinitePolls } from "./useInfinitePolls";

export function InfinitePolls({ query }: { query: string }) {
  const { ref, polls, hasNext } = useInfinitePolls({ query });

  return (
    <>
      {polls.map((poll) => (
        <PollCard key={poll.id} {...poll} />
      ))}
      <div className="flex h-12 w-full items-center justify-center">
        {hasNext ? (
          <span ref={ref} className="loader" />
        ) : (
          <p className="border-b border-neutral-800 text-center text-sm text-neutral-600">
            {polls.length > 0
              ? "Nothing more to show..."
              : "Nothing to show..."}
          </p>
        )}
      </div>
    </>
  );
}
