"use client";

import { useFeaturedPoll } from "../hooks/useFeaturedPoll";

export function FeaturedPollIdHandler({
  featuredPollId,
}: {
  featuredPollId: string;
}) {
  useFeaturedPoll().setFeaturedPollId(featuredPollId);
  return null;
}
