import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSinglePoll } from "@/app/components/InfinitePolls/actions";
import { DeletePollForm } from "@/app/components/CrudPoll/DeletePollForm";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import {
  AllComments,
  AllCommentsFallback,
} from "@/app/components/Comments/AllComments";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function PollPage({ params, searchParams }: Props) {
  const poll = await getSinglePoll({ pollId: params.id });

  if (!poll) return notFound();

  const { userId } = auth();

  return (
    <main className="relative flex min-h-[calc(100dvh-64px)] w-full flex-col gap-1">
      {/* header */}
      <div className="flex flex-col items-start justify-start gap-1 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl">{poll.title}</h1>
          <h2>{poll.description}</h2>
          <span>
            Created by{" "}
            <Link href={`/users/${poll.author.username}`}>
              {poll.author.username}
            </Link>
          </span>
        </div>
        <div className="flex flex-col gap-1 text-sm text-neutral-400 sm:items-end">
          {poll.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {userId === poll.author.id && <DeletePollForm poll={poll} />}
        </div>
      </div>

      <PollCardActions poll={poll} showChart />

      <Suspense fallback={<AllCommentsFallback />}>
        <AllComments
          pollId={params.id}
          parentId={searchParams.parentId as string | undefined}
        />
      </Suspense>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poll = await getSinglePoll({ pollId: params.id });

  const voteCounts: Record<string, number> = {};

  // Count votes for each option
  poll?.votes.forEach((vote) => {
    voteCounts[vote.optionId] = (voteCounts[vote.optionId] ?? 0) + 1;
  });

  // Find the option ID with the most votes
  let maxVotes = 0;
  let winningOptionId: string | null = null;
  for (const optionId in voteCounts) {
    if (voteCounts[optionId] ?? 0 > maxVotes) {
      maxVotes = voteCounts[optionId] ?? 0;
      winningOptionId = optionId;
    }
  }

  const winningOption = poll?.options.find(
    (option) => option.id === winningOptionId,
  );

  return {
    title: poll?.title,
    description: `Winning choice: "${winningOption?.text}", showing the majority's preference.`,
  };
}
