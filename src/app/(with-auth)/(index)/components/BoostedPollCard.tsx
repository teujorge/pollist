"use client";

import { PollCard } from "@/app/components/PollCard/PollCard";
import { useBoostedPoll } from "../hooks/useBoostedPoll";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

export function BoostedPollCard({
  userId,
  poll,
}: {
  userId: string | null;
  poll: PollsDetails[number];
}) {
  const { boostedPoll } = useBoostedPoll();
  return <PollCard poll={boostedPoll ?? poll} userId={userId} />;
}
