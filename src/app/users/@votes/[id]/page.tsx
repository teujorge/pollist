import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";
import { Tabs } from "../../components/Tabs";

export default function MyVotes({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <div
      className={`w-full flex-grow flex-col gap-2 md:w-1/2
      ${searchParams.tab === "votes" ? "flex" : "hidden md:flex"}
    `}
    >
      <Tabs id={params.id} tab="votes" />
      <div className="flex flex-col gap-2 overflow-y-auto rounded-xl border border-neutral-800 p-2">
        <InfinitePolls
          voterId={params.id}
          highlightedUserId={params.id}
          idPrefix="my-votes"
        />
      </div>
    </div>
  );
}
