"use client";

import { useCallback, useEffect, useState } from "react";
import type { PollQuery } from "@/constants";
import { getInfinitePolls, type PollsDetails } from "./actions";

export function useInfinitePolls(props: {
  query: PollQuery;
  loaderRef: React.RefObject<HTMLElement>;
}) {
  const [data, setData] = useState<{
    polls: PollsDetails;
    page: number;
    hasMore: boolean;
    isLoading: boolean;
  }>({ polls: [], page: 1, hasMore: true, isLoading: false });

  const loadMore = useCallback(async () => {
    const initialPage = data.page;
    setData((prev) => ({ ...prev, isLoading: true }));

    const newPolls = await getInfinitePolls({
      page: data.page,
      search: props.query.search,
      category: props.query.category,
      authorId: props.query.authorId,
      voterId: props.query.voterId,
    });

    // If page has changed during async call, ignore this result
    if (data.page < initialPage) return;

    const hasMore = newPolls.length > 0;

    setData((prev) => ({
      ...prev,
      hasMore: hasMore,
      isLoading: false,
      polls: [...prev.polls, ...newPolls],
    }));
  }, [data.page, props.query]);

  // Reset data when query changes
  useEffect(() => {
    // console.log("useEffect - query has changed");
    setData({
      polls: [],
      page: 1,
      hasMore: true,
      isLoading: false,
    });
  }, [props.query]);

  // Change page when loaderRef is intersecting
  useEffect(() => {
    // console.log("useEffect - loaderRef is intersecting");
    function handleObserver(entities: IntersectionObserverEntry[]) {
      // console.log("handleObserver - entities", entities);

      if (!data.hasMore) return;
      if (data.isLoading) return;

      const target = entities[0];
      if (!target || !target.isIntersecting) return;

      // console.log("handleObserver - PASSED conditions");
      setData((prev) => ({ ...prev, page: prev.page + 1 }));
    }

    const option = {
      root: null,
      rootMargin: "200px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (props.loaderRef.current) observer.observe(props.loaderRef.current);

    return () => observer.disconnect();
  }, [data.hasMore, data.isLoading, props.loaderRef]);

  // Load more when page changes
  useEffect(() => {
    if (!data.hasMore) return;
    if (data.isLoading) return;
    // console.log("useEffect - page has changed");
    void loadMore();
  }, [loadMore]);

  return data;
}
