"use client";

import { useEffect } from "react";
import { useBoostedPoll } from "../hooks/useBoostedPoll";

export function BoostedPollIdHandler({
  boostedPollId,
}: {
  boostedPollId: string;
}) {
  const { setBoostedPollId } = useBoostedPoll();
  useEffect(() => {
    setBoostedPollId(boostedPollId);
  }, [setBoostedPollId, boostedPollId]);
  return null;
}
