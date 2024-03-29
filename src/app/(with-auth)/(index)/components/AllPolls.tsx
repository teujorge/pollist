"use client";

import { Loader } from "@/app/components/Loader";
import { PollCard } from "@/app/components/PollCard/PollCard";
import { PAGE_SIZE } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { PollQuery } from "@/constants";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

export function AllPolls({ query }: { query: PollQuery }) {
  async function _queryFn({ cursor }: { cursor: string }) {
    const cursorQuery = cursor === "" ? undefined : `cursor=${cursor}`;
    const searchQuery = query.search ? `search=${query.search}` : undefined;
    const categoryQuery = query.category
      ? `category=${query.category}`
      : undefined;

    const response = await fetch(
      `/api/polls?${cursorQuery}&${searchQuery}&${categoryQuery}`,
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
          <p className="text-sm text-accent-foreground underline decoration-accent-foreground underline-offset-4">
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
