import { db } from "@/database/db";
import { PollCard } from "./components/PollCard/PollCard";
import { SearchBar } from "./index/components/SearchBar";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const polls = await db.poll.findMany({
    where: {
      title: {
        contains: searchParams?.search?.toString(),
      },
    },
    select: { id: true },
  });

  return (
    <main className="flex flex-col items-center gap-4 pt-0">
      <div className="h-4" />
      <div className="sticky top-10 z-10 flex w-full flex-row items-end justify-between border-b border-neutral-800 bg-black py-1 pt-6">
        <h1 className="text-4xl font-bold">Polls</h1>
        <SearchBar />
      </div>
      {polls.map((poll) => (
        <PollCard key={poll.id} pollId={poll.id} />
      ))}
    </main>
  );
}
