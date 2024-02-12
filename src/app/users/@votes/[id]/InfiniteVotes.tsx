"use client";

import InfiniteScroll from "react-infinite-scroller";
import { useInfinitePolls } from "@/app/components/InfinitePolls/useInfinitePolls";
import { Loader } from "@/app/components/Loader";
import { PollCard } from "@/app/components/PollCard/PollCard";
import type { PollQuery } from "@/constants";

export function InfiniteVotes(
  props: PollQuery & { highlightedUserId: string },
) {
  const { data, loadMore } = useInfinitePolls(props);

  return (
    <InfiniteScroll
      key={`${props.search}-${props.category}`}
      useWindow={false}
      className="flex w-full flex-col items-center gap-2"
      pageStart={0}
      loadMore={loadMore}
      hasMore={data.hasMore}
      loader={<Loader />}
    >
      {data.polls.map((poll) => (
        <PollCard
          key={`votes-poll-card-${poll.id}`}
          poll={poll}
          highlightedUserId={props.highlightedUserId}
        />
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
