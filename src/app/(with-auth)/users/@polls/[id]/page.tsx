import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";

export default function MyPolls({ params }: { params: { id: string } }) {
  return <InfinitePolls query={{ authorId: params.id }} idPrefix="my-polls" />;
}
