import { db } from "@/database/db";
import { PollCard } from "./components/PollCard";

export default async function HomePage() {
  const polls = await db.poll.findMany({
    include: { votes: true, options: true },
  });

  return (
    <main className="flex flex-wrap justify-center gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} {...poll} />
      ))}
    </main>
  );
}
