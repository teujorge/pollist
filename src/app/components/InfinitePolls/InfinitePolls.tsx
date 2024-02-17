"use client";

import { useRef } from "react";
import { useInfinitePolls } from "./useInfinitePolls";
import { PollCard } from "../PollCard/PollCard";
import { Loader } from "../Loader";
import type { PollQuery } from "@/constants";

export function InfinitePolls(
  props: PollQuery & { highlightedUserId?: string; idPrefix: string },
) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const data = useInfinitePolls({
    query: props,
    loaderRef: loaderRef,
  });

  console.log("---rendering InfinitePolls---");
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {data.polls.map((poll) => (
        <PollCard
          key={`${props.idPrefix}-poll-card-${poll.id}`}
          poll={poll}
          highlightedUserId={props.highlightedUserId}
        />
      ))}
      <div
        ref={loaderRef}
        className="flex h-12 w-full items-center justify-center"
      >
        {data.hasMore ? (
          <Loader />
        ) : (
          <p className="text-sm text-neutral-400 underline decoration-neutral-400 underline-offset-4">
            Nothing more to show...
          </p>
        )}
      </div>
    </div>
  );
}
