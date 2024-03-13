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
    const response = await fetch(
      `/api/polls?page=${pageParam}&search=${query.search}&category=${query.category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const res = (await response.json()) as
      | { status: number; data: PollsDetails; error: undefined }
      | { status: number; data: undefined; error: string };
    if (res.data === undefined) throw new Error(res.error);

    const polls = res.data;
    hasInitedRef.current = true;
    return polls;
  }

  const { fetchNextPage, hasNextPage, data, status } = useInfiniteQuery({
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
    function handleObserver(entities: IntersectionObserverEntry[]) {
      const target = entities[0];
      if (!target || !target.isIntersecting) return;

      fetchNextPage().catch((e) => console.error(e));
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
      {data?.pages.map((pages, i) => (
        <>
          {pages.map((poll) => (
            <PollCard key={keyGen(i, poll.id)} poll={poll} />
          ))}
        </>
      ))}

      <div
        ref={loaderRef}
        className="flex h-12 w-full items-center justify-center"
      >
        {status === "pending" ||
        hasNextPage ||
        hasInitedRef.current === false ? (
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

function keyGen(index: number, id: string) {
  const key = `home-page-${index}-poll-${id}`;
  return key;
}
