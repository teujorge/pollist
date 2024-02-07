"use client";

import { Loader } from "../Loader";
import { PollCard } from "../PollCard/PollCard";
import { useInfinitePolls } from "./useInfinitePolls";
import type { PollQuery } from "@/constants";

export function InfinitePolls(query: PollQuery) {
  const { ref, polls, hasNext } = useInfinitePolls(query);

  return (
    <>
      {polls.map((poll) => (
        <PollCard key={poll.id} {...poll} />
      ))}
      <div className="flex h-12 w-full items-center justify-center">
        {hasNext ? (
          <Loader ref={ref} />
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
