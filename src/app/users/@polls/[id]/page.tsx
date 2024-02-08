import { PollCard } from "@/app/components/PollCard/PollCard";
import { db } from "@/database/db";

export default async function MyPolls({ params }: { params: { id: string } }) {
  const polls = await db.poll.findMany({
    where: {
      authorId: params.id,
    },
    include: {
      author: true,
      votes: true,
      options: true,
    },
  });

  return (
    <>
      {polls.map((poll) => (
        <PollCard key={poll.id} {...poll} />
      ))}
    </>
  );
}
