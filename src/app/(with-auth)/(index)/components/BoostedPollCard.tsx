"use client";

import { PollCard } from "@/app/components/PollCard/PollCard";
import { useBoostedPoll } from "../hooks/useBoostedPoll";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";
import { useEffect } from "react";

export function BoostedPollCard({
  userId,
  poll,
}: {
  userId: string | null;
  poll: PollsDetails[number];
}) {
  const { boostedPoll, setBoostedPoll } = useBoostedPoll();

  useEffect(() => {
    setBoostedPoll(poll);
  }, [setBoostedPoll, poll]);

  return <PollCard poll={boostedPoll ?? poll} userId={userId} />;
}
