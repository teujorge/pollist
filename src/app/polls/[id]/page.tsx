import Link from "next/link";
import { db } from "@/database/db";
import { notFound } from "next/navigation";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import { DeletePollButton } from "@/app/polls/components/DeletePollButton";

export default async function PollPage({ params }: { params: { id: string } }) {
  const poll = await db.poll.findUnique({
    where: {
      id: params.id,
      OR: [
        { expiresAt: { gte: new Date() } }, // Polls that expire in the future
        { expiresAt: null }, // Polls with no expiration date
      ],
    },
    include: {
      options: true,
      votes: true,
      author: true,
    },
  });

  if (!poll) return notFound();

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
          <DeletePollButton pollId={poll.id} pollAuthorId={poll.author.id} />
        </div>
      </div>

      <Link href={`/polls/${params.id}/comments`}>Comments</Link>

      <PollCardVoting poll={poll} useRealtime useChart />
    </main>
  );
}
