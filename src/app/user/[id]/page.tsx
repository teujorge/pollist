/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TcpY2hkdR17
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { db } from "@/database/db";
import Image from "next/image";
import Link from "next/link";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      polls: true,
      votes: true,
    },
  });

  if (!user) return { notFound: true };

  return (
    <main className="flex min-h-full w-full flex-col justify-center gap-4">
      {user.imageUrl && (
        <Image
          src={user.imageUrl}
          alt={user.username ?? "Users's avatar"}
          width={100}
          height={100}
        />
      )}
      <h1>{user.username}</h1>

      <div className="w-fit gap-2 border border-neutral-800 p-2">
        <h2>Created Polls</h2>
        {user.polls.map((poll) => (
          <Link key={poll.id} href={`/poll/${poll.id}`}>
            <h2>{poll.title}</h2>
            <p>{poll.description}</p>
          </Link>
        ))}
      </div>

      <div className="w-fit gap-2 border border-neutral-800 p-4">
        <h2>Votes</h2>
        {user.votes.map((vote) => (
          <Link key={vote.id} href={`/poll/${vote.pollId}`}>
            <h2>{vote.pollId}</h2>
            <p>{vote.optionId}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
