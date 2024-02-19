import { TabManagement } from "../../components/TabManagement";
import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";

export default function MyVotes({ params }: { params: { id: string } }) {
  return (
    <TabManagement tabKey="votes">
      <InfinitePolls
        voterId={params.id}
        highlightedUserId={params.id}
        idPrefix="my-votes"
      />
    </TabManagement>
  );
}
