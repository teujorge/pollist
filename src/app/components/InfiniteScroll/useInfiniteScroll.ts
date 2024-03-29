"use client";

import { PAGE_SIZE } from "@/constants";
import { useEffect, useState } from "react";

export function useInfiniteScroll<TItem extends { id: string }, TQuery>(props: {
  query: TQuery;
  initialCursor?: string;
  getter: (params: TQuery & { cursor: string | undefined }) => Promise<TItem[]>;
  loaderRef: React.RefObject<HTMLElement>;
}) {
  type Data = {
    items: TItem[];
    cursor?: string;
    hasMore: boolean;
    isLoading: boolean;
  };

  const initialData: Data = {
    items: [],
    cursor: props.initialCursor,
    hasMore: true,
    isLoading: false,
  };

  const [data, setData] = useState(initialData);

  // Change page when loaderRef is intersecting
  useEffect(() => {
    async function loadMore() {
      const localInitialData = { ...data };

      try {
        setData((prev) => ({
          ...prev,
          isLoading: true,
        }));

        const newItems = await props.getter({
          cursor: data.cursor,
          ...props.query,
        });

        // another query change happened
        if (localInitialData.cursor !== data.cursor) return;

        const hasMore = newItems.length === PAGE_SIZE;

        setData((prev) => ({
          ...prev,
          cursor: newItems[newItems.length - 1]?.id,
          hasMore: hasMore,
          isLoading: false,
          items: [...prev.items, ...newItems],
        }));
      } catch (e) {
        setData(localInitialData);
      }
    }

    function handleObserver(entities: IntersectionObserverEntry[]) {
      if (!data.hasMore) return;
      if (data.isLoading) return;

      const target = entities[0];
      if (!target?.isIntersecting) return;

      void loadMore();
    }

    const option = {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (props.loaderRef.current) observer.observe(props.loaderRef.current);

    return () => observer.disconnect();
  }, [data, props]);

  return data;
}
