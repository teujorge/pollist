"use client";

import { useEffect } from "react";
import { useBoostedPoll } from "../hooks/useBoostedPoll";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

export function BoostedPollPersistanceHandler({
  boostedPoll: _boostedPoll,
}: {
  boostedPoll: PollsDetails[number];
}) {
  const { boostedPoll, setBoostedPoll } = useBoostedPoll();

  useEffect(() => {
    if (!boostedPoll) setBoostedPoll(_boostedPoll);
  }, [_boostedPoll, boostedPoll, setBoostedPoll]);

  return null;
}
