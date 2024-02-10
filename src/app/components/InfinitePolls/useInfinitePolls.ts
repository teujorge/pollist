"use client";

import { useEffect, useState } from "react";
import type { PollQuery } from "@/constants";
import { getInfinitePolls, type PollsDetails } from "./actions";

export function useInfinitePolls(query: PollQuery) {
  const [data, setData] = useState<{
    polls: PollsDetails;
    hasMore: boolean;
  }>({ polls: [], hasMore: true });

  async function loadMore(page: number) {
    const newPolls = await getInfinitePolls({
      page: page,
      search: query.search,
      category: query.category,
    });

    const hasMore = newPolls.length > 0;

    setData((prev) => ({
      hasMore: hasMore,
      polls: [...prev.polls, ...newPolls],
    }));
  }

  useEffect(() => {
    setData({ polls: [], hasMore: true });
  }, [query]);

  return {
    data,
    loadMore,
  };
}
