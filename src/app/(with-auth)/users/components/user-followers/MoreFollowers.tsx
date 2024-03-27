"use client";

import { getMoreFollowers } from "./actions";
import { ActiveFollowerCard } from "./ActiveFollowerCard";
import { InfinitelyMoreItems } from "@/app/components/InfiniteScroll/InfinitelyMoreItems";
import type { Followers } from "./actions";

export function MoreFollowers({
  userId,
  initialCursor,
}: {
  userId: string;
  initialCursor: string;
}) {
  return (
    <InfinitelyMoreItems<Followers[number], { userId: string }>
      idPrefix={"more-followees"}
      ItemComponent={(follower) => (
        <ActiveFollowerCard userId={userId} follower={follower} />
      )}
      query={{ userId: userId }}
      initialCursor={initialCursor}
      getter={getMoreFollowers}
      loaderClassName="w-5 h-5 border-2"
    />
  );
}
