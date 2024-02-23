"use client";

import { PAGE_SIZE } from "@/constants";
import { useEffect, useState } from "react";

export function useInfiniteScroll<TItem, TQuery>(props: {
  query: TQuery;
  getter: (params: TQuery & { page: number }) => Promise<TItem[]>;
  loaderRef: React.RefObject<HTMLElement>;
}) {
  type Data = {
    items: TItem[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
  };

  const initialData: Data = {
    items: [],
    page: 2,
    hasMore: true,
    isLoading: false,
  };

  const [data, setData] = useState(initialData);

  // Change page when loaderRef is intersecting
  useEffect(() => {
    async function loadMore() {
      const initialData = data;

      try {
        setData((prev) => ({ ...prev, page: prev.page + 1, isLoading: true }));

        const newItems = await props.getter({
          page: data.page,
          ...props.query,
        });

        // another query change happened
        if (initialData.page !== data.page) return;

        const hasMore = newItems.length === PAGE_SIZE;

        setData((prev) => ({
          ...prev,
          hasMore: hasMore,
          isLoading: false,
          items: [...prev.items, ...newItems],
        }));
      } catch (e) {
        console.error(e);
        setData(initialData);
      }
    }

    // console.log("useEffect - loaderRef is intersecting");
    function handleObserver(entities: IntersectionObserverEntry[]) {
      if (!data.hasMore) return;
      if (data.isLoading) return;

      const target = entities[0];
      if (!target || !target.isIntersecting) return;

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
  }, [data, props]);

  return data;
}
