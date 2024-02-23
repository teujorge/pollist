import { PollCard } from "../PollCard/PollCard";
import { getInfinitePolls } from "./actions";

import type { PollQuery } from "@/constants";
import { InfinitelyMorePolls } from "./InfinitelyMorePolls";

export async function InfinitePolls(props: {
  query: PollQuery;
  highlightedUserId?: string;
  idPrefix: string;
}) {
  const firstPolls = await getInfinitePolls({
    page: 1,
    ...props.query,
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
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
