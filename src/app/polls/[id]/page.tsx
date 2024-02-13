/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TcpY2hkdR17
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link";
import { db } from "@/database/db";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import { auth } from "@clerk/nextjs";

export default async function PollPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  const poll = await db.poll.findUnique({
    where: {
      id: params.id,
    },
    include: {
      options: true,
      votes: true,
      author: true,
    },
  });

  if (!poll) return { notFound: true };

  return (
    <main className="flex min-h-[calc(100dvh-64px)] w-full flex-col">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl">{poll.title}</h1>
          <h2>{poll.description}</h2>
          <span>
            Created by{" "}
            <Link href={`/users/${poll.author.id}`}>
              {poll.author.username}
            </Link>
          </span>
        </div>
        <div className="flex flex-row gap-2 text-sm text-neutral-400">
          Created on{" "}
          {new Date(poll.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {userId === poll.authorId && (
            <Link
              href={`/polls/delete?id=${poll.id}`}
              className="text-red-500 hovact:text-red-400"
            >
              Delete
            </Link>
          )}
        </div>
      </div>

      <PollCardVoting poll={poll} useRealtime useChart />
    </main>
  );
}
