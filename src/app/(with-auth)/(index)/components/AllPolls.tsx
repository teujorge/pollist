"use client";

import { Star } from "@phosphor-icons/react";
import { Loader } from "@/app/components/Loader";
import { PollCard } from "@/app/components/PollCard/PollCard";
import { PAGE_SIZE } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { PollQuery } from "@/constants";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

export function AllPolls({
  userId,
  query,
}: {
  userId: string | null;
  query: PollQuery;
}) {
  const [boostedPoll, setBoostedPoll] = useState<
    PollsDetails[number] | undefined
  >(undefined);

  async function _queryFn({ cursor }: { cursor: string }) {
    const queries = [];

    if (cursor) queries.push(`cursor=${encodeURIComponent(cursor)}`);
    if (query.search)
      queries.push(`search=${encodeURIComponent(query.search)}`);
    if (query.category)
      queries.push(`category=${encodeURIComponent(query.category)}`);
    if (boostedPoll?.id)
      queries.push(`boostedId=${encodeURIComponent(boostedPoll.id)}`);

    const queryString = queries.join("&");

    const response = await fetch(`/api/polls?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const res = (await response.json()) as
      | { status: number; data: PollsDetails; error: undefined }
      | { status: number; data: undefined; error: string };
    if (res.data === undefined) throw new Error(res.error);

    const polls = res.data;
    hasInitedRef.current = true;

    if (cursor === "" && polls[0]?.boostedById !== null) {
      setBoostedPoll(polls[0]);
    }

    return polls;
  }

  const { fetchNextPage, hasNextPage, data, status } = useInfiniteQuery({
    queryKey: ["all-polls", query],
    queryFn: (ctx) => _queryFn({ cursor: ctx.pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (allPageParams.length === 0) {
        return "";
      }
      if (lastPage.length === PAGE_SIZE) {
        return lastPage[lastPage.length - 1]?.id;
      }
      return undefined;
    },
  });

  const hasInitedRef = useRef<boolean>(data !== undefined);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleObserver(entities: IntersectionObserverEntry[]) {
      const target = entities[0];
      if (!target?.isIntersecting) return;

      void fetchNextPage();
    }

    const option = {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, data]);

  return (
    <div className="flex w-full flex-col gap-4">
      {data?.pages.map((pages, pageIndex) =>
        pages.map((poll, itemIndex) =>
          poll.boostedById === null ? (
            <PollCard
              key={keyGen(pageIndex, itemIndex, poll.id)}
              poll={poll}
              userId={userId}
            />
          ) : (
            <div
              key={keyGen(pageIndex, itemIndex, poll.id)}
              className="relative h-fit w-full"
            >
              <PollCard
                key={keyGen(pageIndex, itemIndex, poll.id)}
                poll={poll}
                userId={userId}
                className={
                  poll.boostedById !== null ? "border-primary" : undefined
                }
              />
              <div className="absolute right-0 top-0 flex flex-row items-center justify-center gap-1 rounded-bl-lg rounded-tr-lg bg-primary px-2 py-1 text-xs font-light text-primary-foreground">
                <Star /> BOOSTED
              </div>
            </div>
          ),
        ),
      )}

      <div
        ref={loaderRef}
        className="flex h-12 w-full items-center justify-center"
      >
        {status === "pending" ||
        hasNextPage ||
        hasInitedRef.current === false ? (
          <Loader />
        ) : (
          <p className="text-sm text-accent-foreground underline decoration-accent-foreground underline-offset-4">
            Nothing more to show...
          </p>
        )}
      </div>
    </div>
  );
}

function keyGen(index1: number, index2: number, id: string) {
  const key = `home-page-${index1}-${index2}-poll-${id}`;
  return key;
}
