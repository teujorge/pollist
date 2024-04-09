"use client";

import { useBoostedPoll } from "../hooks/useBoostedPoll";

export function BoostedPollIdHandler({
  boostedPollId,
}: {
  boostedPollId: string;
}) {
  const bp = useBoostedPoll();
  bp.setBoostedPollId(boostedPollId);
  return null;
}
