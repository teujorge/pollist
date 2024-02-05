import { db } from "@/database/db";
import { PollCard } from "./components/PollCard/PollCard";
import { SearchBar } from "./index/components/SearchBar";

const PAGE_SIZE = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const dangerousPage = Math.max(
    parseInt(searchParams?.page?.toString() ?? "1"),
    1,
  );
  const page = isNaN(dangerousPage) ? 1 : dangerousPage;
  const search = searchParams?.search?.toString() ?? "";

  const polls = await db.poll.findMany({
    where: { title: { contains: search } },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <main className="flex flex-col items-center gap-4 pt-0">
      <div className="h-4" />
      <div className="sticky top-10 z-10 flex w-full flex-row items-end justify-between border-b border-neutral-800 bg-black py-1 pt-6">
        <h1 className="text-4xl font-bold">Polls</h1>
        <SearchBar
          hasNext={polls.length % PAGE_SIZE === 0 && polls.length !== 0}
        />
      </div>
      {polls.map((poll) => (
        <PollCard key={poll.id} pollId={poll.id} />
      ))}
    </main>
  );
}
