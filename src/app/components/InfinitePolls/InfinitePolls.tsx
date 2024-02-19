import { PollCard } from "../PollCard/PollCard";
import { getInfinitePolls } from "./actions";
import { InfinitelyMorePolls } from "./InfinitelyMorePolls";
import type { PollQuery } from "@/constants";

export async function InfinitePolls(
  props: PollQuery & { highlightedUserId?: string; idPrefix: string },
) {
  const firstPolls = await getInfinitePolls({
    page: 1,
    search: props.search,
    category: props.category,
    authorId: props.authorId,
    voterId: props.voterId,
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
      <InfinitelyMorePolls {...props} />
    </div>
  );
}
