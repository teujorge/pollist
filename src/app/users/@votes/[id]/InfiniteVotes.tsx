import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";
import type { PollQuery } from "@/constants";

export function InfiniteVotes(
  props: PollQuery & { highlightedUserId: string },
) {
  return <InfinitePolls {...props} idPrefix="my-votes" />;
}
