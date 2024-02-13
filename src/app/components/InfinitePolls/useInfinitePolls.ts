"use client";

import { useEffect, useRef, useState } from "react";

import { type PollsDetails, getInfinitePolls } from "./actions";
import type { PollQuery } from "@/constants";

type Data = {
  polls: PollsDetails;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
};

const initialData: Data = {
  polls: [],
  page: 1,
  hasMore: true,
  isLoading: false,
};

export function useInfinitePolls(props: {
  query: PollQuery;
  loaderRef: React.RefObject<HTMLElement>;
}) {
  const initRef = useRef(false);

  const [data, setData] = useState(initialData);

  // Reset data when query changes
  useEffect(() => {
    if (!initRef.current) return;
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
    async function loadMore() {
      const initialData = data;

      try {
        setData((prev) => ({ ...prev, page: prev.page + 1, isLoading: true }));

        const newPolls = await getInfinitePolls({
          page: data.page,
          search: props.query.search,
          category: props.query.category,
          authorId: props.query.authorId,
          voterId: props.query.voterId,
        });

        // another query change happened
        if (initialData.page !== data.page) return;

        const hasMore = newPolls.length > 0;

        setData((prev) => ({
          ...prev,
          hasMore: hasMore,
          isLoading: false,
          polls: [...prev.polls, ...newPolls],
        }));

        initRef.current = true;
      } catch (e) {
        console.error(e);
        setData(initialData);
      }
    }

    // console.log("useEffect - loaderRef is intersecting");
    function handleObserver(entities: IntersectionObserverEntry[]) {
      // console.log("handleObserver - entities", entities);

      if (!data.hasMore) return;
      if (data.isLoading) return;

      const target = entities[0];
      if (!target || !target.isIntersecting) return;

      // console.log("handleObserver - PASSED conditions");
      void loadMore();
    }

    const option = {
      root: null,
      rootMargin: "200px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (props.loaderRef.current) observer.observe(props.loaderRef.current);

    return () => observer.disconnect();
  }, [data, props.loaderRef, props.query]);

  return data;
}
