import { PollCard } from "../PollCard/PollCard";
import { InfinitelyMorePolls } from "./InfinitelyMorePolls";
import { getInfinitePolls } from "./actions";
import type { PollQuery } from "@/constants";

export async function FirstAndMorePolls(
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
    <>
      {firstPolls.map((poll) => (
        <PollCard
          key={`${props.idPrefix}-poll-card-${poll.id}`}
          poll={poll}
          highlightedUserId={props.highlightedUserId}
        />
      ))}
      <InfinitelyMorePolls {...props} />
    </>
  );
}
