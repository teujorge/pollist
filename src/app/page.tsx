import { db } from "@/database/db";
import { PollCard } from "./components/PollCard/PollCard";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const polls = await db.poll.findMany({
    select: { id: true },
  });

  return (
    <main className="flex flex-wrap justify-center gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} pollId={poll.id} />
      ))}
    </main>
  );
}
