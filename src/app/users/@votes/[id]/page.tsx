import { db } from "@/database/db";
import { Card } from "@/app/components/Card";
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
    <>
      {votes.map((vote) => (
        <Link key={vote.id} href={`/polls/${vote.pollId}`}>
          <div className=" rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
            <h2>
              <span className="font-extrabold text-purple-500">Title: </span>
              {vote.poll.title}
            </h2>
            <p>
              <span className="font-extrabold text-purple-500">Vote:</span>{" "}
              {vote.option.text}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
