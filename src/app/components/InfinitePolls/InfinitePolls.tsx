"use client";

import InfiniteScroll from "react-infinite-scroller";
import { PollCard } from "../PollCard/PollCard";
import { useInfinitePolls } from "./useInfinitePolls";
import { Loader } from "../Loader";
import type { PollQuery } from "@/constants";

export function InfinitePolls(query: PollQuery) {
  const { data, loadMore } = useInfinitePolls(query);

  return (
    <InfiniteScroll
      key={`${query.search}-${query.category}`}
      useWindow={false}
      className="flex w-full flex-col items-center gap-2"
      pageStart={0}
      loadMore={loadMore}
      hasMore={data.hasMore}
      loader={<Loader />}
    >
      {data.polls.map((poll) => (
        <PollCard key={`poll-card-${poll.id}`} poll={poll} />
      ))}
      {!data.hasMore && (
        <div className="flex h-10 w-full items-center justify-center">
          <p className="text-sm text-neutral-400 underline decoration-neutral-400 underline-offset-4">
            Nothing more to show...
          </p>
        </div>
      )}
    </InfiniteScroll>
  );
}
