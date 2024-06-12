"use client";

import { Loader } from "@/app/components/Loader";
import { UserCard } from "@/app/components/InfiniteUsers/UserCard";
import { PAGE_SIZE } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { UsersDetails } from "@/app/components/InfiniteUsers/actions";

export function AllUsers({
  userId,
  query,
}: {
  userId: string | null;
  query: { username: string };
}) {
  async function _queryFn({ cursor }: { cursor: string }) {
    const cursorQuery = cursor === "" ? undefined : `cursor=${cursor}`;
    const searchQuery = `search=${query.username}`;

    const response = await fetch(`/api/users?${cursorQuery}&${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await response.json()) as
      | { status: number; data: UsersDetails; error: undefined }
      | { status: number; data: undefined; error: string };
    if (res.data === undefined) throw new Error(res.error);

    const users = res.data;
    hasInitedRef.current = true;
    return users;
  }

  const { fetchNextPage, hasNextPage, data, status } = useInfiniteQuery({
    queryKey: ["all-users", query],
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
    <div className="flex w-full flex-wrap justify-center gap-4">
      {data?.pages.map((pages, i) =>
        pages.map((user) => (
          <UserCard key={keyGen(i, user.id)} user={user} userId={userId} />
        )),
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

function keyGen(index: number, id: string) {
  const key = `home-page-${index}-user-${id}`;
  return key;
}
