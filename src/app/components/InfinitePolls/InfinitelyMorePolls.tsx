"use client";

import { PollCard } from "../PollCard/PollCard";
import { getInfinitePolls } from "./actions";
import { InfinitelyMoreItems } from "../InfiniteScroll/InfinitelyMoreItems";
import type { PollQuery } from "@/constants";
import type { PollsDetails } from "./actions";

export function InfinitelyMorePolls(props: {
  userId: string | null;
  query: PollQuery;
  highlightedUserId?: string;
  idPrefix: string;
  initialCursor: string | undefined;
}) {
  return (
    <InfinitelyMoreItems<PollsDetails[number], PollQuery>
      idPrefix={props.idPrefix}
      query={props.query}
      getter={getInfinitePolls}
      initialCursor={props.initialCursor}
      ItemComponent={(poll) => (
        <PollCard
          poll={poll}
          userId={props.userId}
          highlightedUserId={props.highlightedUserId}
        />
      )}
    />
  );
}
