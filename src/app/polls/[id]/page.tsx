import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSinglePoll } from "@/app/components/InfinitePolls/actions";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import { DeletePollButton } from "@/app/polls/components/DeletePollButton";
import {
  AllComments,
  AllCommentsFallback,
} from "@/app/components/Comments/AllComments";

export default async function PollPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | undefined>;
}) {
  const poll = await getSinglePoll({ pollId: params.id });

  if (!poll) return notFound();

  return (
    <main className="relative flex min-h-[calc(100dvh-64px)] w-full flex-col">
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
          {poll.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <DeletePollButton pollId={poll.id} pollAuthorId={poll.author.id} />
        </div>
      </div>

      <PollCardActions poll={poll} showChart />

      <Suspense fallback={<AllCommentsFallback />}>
        <AllComments pollId={params.id} parentId={searchParams.parentId} />
      </Suspense>
    </main>
  );
}
