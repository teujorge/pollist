import { Card } from "@/app/components/Card";
import { PollCard } from "@/app/components/PollCard/PollCard";
import { db } from "@/database/db";

export default async function MyPolls({ params }: { params: { id: string } }) {
  const polls = await db.poll.findMany({
    where: {
      authorId: params.id,
    },
    select: { id: true },
  });

  return (
    <Card>
      <h2>Polls</h2>
      {polls.map((poll) => (
        <PollCard key={poll.id} pollId={poll.id} />
      ))}
    </Card>
  );
}