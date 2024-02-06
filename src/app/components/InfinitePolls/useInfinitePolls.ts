"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { getPolls } from "./actions";
import { toast } from "sonner";
import { PAGE_SIZE } from "@/constants";
import type { PollDetails } from "../PollCard/types";

export function useInfinitePolls({ query }: { query: string }) {
  const pageRef = useRef(1);

  const [ref, entry] = useIntersectionObserver();

  const [polls, setPolls] = useState<PollDetails[]>([]);

  const [hasNext, setHasNext] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPolls([]);
    pageRef.current = 1;
    setHasNext(true);
  }, [query]);

  useEffect(() => {
    if (isLoading) return;
    if (!hasNext) return;
    if (!entry?.isIntersecting) return;

    setIsLoading(true);
    getPolls({ page: pageRef.current, search: query })
      .then((newPolls) => {
        pageRef.current++;
        setPolls((prevPolls) => [...prevPolls, ...newPolls]);
        if (newPolls.length < PAGE_SIZE) setHasNext(false);
      })
      .catch((e) => {
        toast.error("Failed to load polls");
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [entry?.isIntersecting, hasNext]);

  return {
    ref,
    polls,
    hasNext,
  };
}
