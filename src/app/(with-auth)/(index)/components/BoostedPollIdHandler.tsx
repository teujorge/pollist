"use client";

import { useBoostedPoll } from "../hooks/useBoostedPoll";

export function BoostedPollIdHandler({
  boostedPollId,
}: {
  boostedPollId: string;
}) {
  useBoostedPoll().setBoostedPollId(boostedPollId);
  return null;
}
