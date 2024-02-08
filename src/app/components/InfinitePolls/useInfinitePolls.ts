"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PAGE_SIZE, type PollQuery } from "@/constants";
import { type PollsDetails, getPolls } from "./actions";

export function useInfinitePolls(query: PollQuery) {
  const pageRef = useRef(1);

  const [ref, entry] = useIntersectionObserver();

  const [polls, setPolls] = useState<PollsDetails>([]);

  const [hasNext, setHasNext] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPolls([]);
    pageRef.current = 1;
    setHasNext(true);
  }, [query]);

  useEffect(() => {
    const loadPolls = async () => {
      if (isLoading || !hasNext) return;

      setIsLoading(true);

      try {
        const newPolls = await getPolls({
          page: pageRef.current,
          search: query.search,
          category: query.category,
        });

        // Append new page
        setPolls((prevPolls) => [...prevPolls, ...newPolls]);
        pageRef.current++;

        // Check if there are no more polls to load
        if (newPolls.length < PAGE_SIZE) setHasNext(false);
      } catch (e) {
        toast.error("Failed to load polls");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading || !hasNext || !entry?.isIntersecting) return;

    void loadPolls();
  }, [entry?.isIntersecting, hasNext, isLoading, query]);

  return {
    ref,
    polls,
    hasNext,
  };
}
