import { auth } from "@clerk/nextjs";
import { PollCard } from "../PollCard/PollCard";
import { getInfinitePolls } from "./actions";
import { InfinitelyMorePolls } from "./InfinitelyMorePolls";
import type { PollQuery } from "@/constants";

export const dynamic = "force-dynamic";

export async function InfinitePolls(props: {
  query: PollQuery;
  highlightedUserId?: string;
  idPrefix: string;
}) {
  const { userId } = auth();

  const firstPolls = await getInfinitePolls({
    cursor: undefined,
    ...props.query,
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {firstPolls.map((poll) => (
        <PollCard
          key={`${props.idPrefix}-poll-card-${poll.id}`}
          poll={poll}
          userId={userId}
          highlightedUserId={props.highlightedUserId}
        />
      ))}
      <InfinitelyMorePolls
        idPrefix={props.idPrefix}
        userId={userId}
        query={props.query}
        initialCursor={firstPolls[firstPolls.length - 1]?.id}
        highlightedUserId={props.highlightedUserId}
      />
    </div>
  );
}
