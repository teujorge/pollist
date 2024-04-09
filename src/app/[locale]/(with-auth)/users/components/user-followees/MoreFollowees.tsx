"use client";

import { getMoreFollowees } from "./actions";
import { ActiveFolloweeCard } from "./ActiveFolloweeCard";
import { InfinitelyMoreItems } from "@/app/components/InfiniteScroll/InfinitelyMoreItems";
import type { Followees } from "./actions";

export function MoreFollowees({
  userId,
  initialCursor,
}: {
  userId: string;
  initialCursor: string;
}) {
  return (
    <InfinitelyMoreItems<Followees[number], { userId: string }>
      idPrefix={"more-followees"}
      ItemComponent={(followee) => (
        <ActiveFolloweeCard userId={userId} followee={followee} />
      )}
      query={{ userId: userId }}
      initialCursor={initialCursor}
      getter={getMoreFollowees}
      loaderClassName="w-5 h-5 border-2"
    />
  );
}
