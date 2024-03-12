"use client";

import { Loader } from "@/app/components/Loader";
import { PollCard } from "@/app/components/PollCard/PollCard";
import { PAGE_SIZE } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { PollQuery } from "@/constants";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

export function AllPolls({ query }: { query: PollQuery }) {
  async function _queryFn({ pageParam }: { pageParam: number }) {
    console.log("---------_queryFn -> pageParam", pageParam);

    const searchQuery = query.search ? `&search=${query.search}` : "";
    const categoryQuery = query.category ? `&category=${query.category}` : "";
    const authorIdQuery = query.authorId ? `&authorId=${query.authorId}` : "";
    const voterIdQuery = query.voterId ? `&voterId=${query.voterId}` : "";

    const res = await fetch(
      `/api/polls?page=${pageParam}${searchQuery}${categoryQuery}${authorIdQuery}${voterIdQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const polls = ((await res.json()) as { status: number; data: unknown })
      .data as PollsDetails;

    console.log("---------_queryFn -> polls", polls);

    hasInitedRef.current = true;

    return polls;
  }

  const { fetchNextPage, hasNextPage, data, error, status } = useInfiniteQuery({
    queryKey: ["polls", query],
    queryFn: _queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (allPageParams.length === 0) return 1;
      if (lastPage.length === PAGE_SIZE) return lastPageParam + 1;
      return undefined;
    },
  });

  const hasInitedRef = useRef<boolean>(data !== undefined);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("---------useEffect -> create observer");

    async function nextPage() {
      console.log("---------fetchNextPage", fetchNextPage);
      console.log("---------hasNextPage", hasNextPage);

      const x = await fetchNextPage();
      console.log("---------x", x);
    }

    function handleObserver(entities: IntersectionObserverEntry[]) {
      const target = entities[0];
      if (!target || !target.isIntersecting) return;

      nextPage().catch((e) => console.error(e));
    }

    const option = {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    else console.error("---------loaderRef.current is null");

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, data]);

  useEffect(() => {
    scrollTo(0, 1000);
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <p>status: {status}</p>
      <p>error: {error?.message}</p>

      {data?.pages.map((pages, i) => (
        <>
          {pages.map((poll) => (
            <PollCard key={`home-page-${i}-poll-${poll.id}`} poll={poll} />
          ))}
        </>
      ))}

      <div
        ref={loaderRef}
        className="flex h-12 w-full items-center justify-center"
      >
        {hasNextPage || hasInitedRef.current === false ? (
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
