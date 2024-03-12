import { PollCard } from "../PollCard/PollCard";
import { getPaginatedPolls } from "./actions";
import { InfinitelyMorePolls } from "./InfinitelyMorePolls";
import type { PollQuery } from "@/constants";

export const dynamic = "force-dynamic";

export async function InfinitePolls(props: {
  query: PollQuery;
  highlightedUserId?: string;
  idPrefix: string;
}) {
  const firstPolls = await getPaginatedPolls({
    page: 1,
    ...props.query,
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {firstPolls.map((poll) => (
        <PollCard
          key={`${props.idPrefix}-poll-card-${poll.id}`}
          poll={poll}
          highlightedUserId={props.highlightedUserId}
        />
      ))}
      <InfinitelyMorePolls
        idPrefix={props.idPrefix}
        query={props.query}
        highlightedUserId={props.highlightedUserId}
      />
    </div>
  );
}
