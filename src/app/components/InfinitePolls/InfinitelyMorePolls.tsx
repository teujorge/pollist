"use client";

import { PollCard } from "../PollCard/PollCard";
import { InfinitelyMoreItems } from "../InfiniteScroll/InfinitelyMoreItems";
import { getInfinitePolls, type PollsDetails } from "./actions";
import type { PollQuery } from "@/constants";

export async function InfinitelyMorePolls(props: {
  query: PollQuery;
  highlightedUserId?: string;
  idPrefix: string;
}) {
  return (
    <InfinitelyMoreItems<PollsDetails[number], PollQuery>
      idPrefix={props.idPrefix}
      query={props.query}
      getter={getInfinitePolls}
      ItemComponent={(poll) => (
        <PollCard poll={poll} highlightedUserId={props.highlightedUserId} />
      )}
    />
  );
}
