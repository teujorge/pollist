import { db } from "@/database/db";
import { PollCard } from "./components/PollCard";

export default async function HomePage() {
  const polls = await db.poll.findMany({
    include: { votes: true, options: true },
  });

  return (
    <main>
      {polls.map((poll) => (
        <PollCard key={poll.id} {...poll} />
      ))}
    </main>
  );
}
