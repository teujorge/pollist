import { auth } from "@clerk/nextjs/server";
import { PollCard } from "../PollCard/PollCard";
import { getInfinitePolls } from "./actions";
import { InfinitelyMorePolls } from "./InfinitelyMorePolls";
import type { PollQuery } from "@/constants";

export const dynamic = "force-dynamic";

export async function InfinitePolls({
  query,
  highlightedUserId,
  idPrefix,
}: {
  query: PollQuery;
  highlightedUserId?: string;
  idPrefix: string;
}) {
  const { userId } = auth();

  const firstPolls = await getInfinitePolls({
    cursor: undefined,
    ...query,
    boostedId: "None", // force no boosted poll
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {firstPolls.map((poll) => (
        <PollCard
          key={`${idPrefix}-poll-card-${poll.id}`}
          poll={poll}
          userId={userId}
          highlightedUserId={highlightedUserId}
        />
      ))}
      <InfinitelyMorePolls
        idPrefix={idPrefix}
        userId={userId}
        query={query}
        initialCursor={firstPolls[firstPolls.length - 1]?.id}
        highlightedUserId={highlightedUserId}
      />
    </div>
  );
}
