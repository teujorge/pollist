import { db } from "@/database/db";
import { Card } from "@/app/components/Card";
import { PollCard } from "@/app/components/PollCard/PollCard";
import Link from "next/link";

export default async function MyVotes({ params }: { params: { id: string } }) {
  const votes = await db.vote.findMany({
    where: {
      voterId: params.id,
    },
    include: {
      poll: true,
      option: true,
      voter: true,
    },
  });

  return (
    <Card>
      <h2>Votes</h2>
      {votes.map((vote) => (
        <Link key={vote.id} href={`/poll/${vote.pollId}`}>
          <h2>{vote.poll.title}</h2>
          <p>{vote.option.text}</p>
        </Link>
      ))}
    </Card>
  );
}
