import { TabManagement } from "../../components/TabManagement";
import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";

export default function MyPolls({ params }: { params: { id: string } }) {
  return (
    <TabManagement tabKey="polls">
      <InfinitePolls authorId={params.id} idPrefix="my-polls" />
    </TabManagement>
  );
}
