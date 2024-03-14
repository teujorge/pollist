import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";

export default function MyVotes({ params }: { params: { id: string } }) {
  return (
    <InfinitePolls
      query={{ voterId: params.id }}
      highlightedUserId={params.id}
      idPrefix="my-votes"
    />
  );
}
