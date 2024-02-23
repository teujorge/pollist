import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";
import { TabManagement } from "../../components/TabManagement";

export default function MyVotes({ params }: { params: { id: string } }) {
  return (
    <TabManagement tabKey="votes">
      <InfinitePolls
        query={{ voterId: params.id }}
        highlightedUserId={params.id}
        idPrefix="my-votes"
      />
    </TabManagement>
  );
}
