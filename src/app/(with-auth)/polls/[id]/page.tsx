import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSinglePoll } from "@/app/components/InfinitePolls/actions";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import { uppercaseFirstLetterOfEachSentence } from "@/lib/utils";
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
      <div className="flex flex-col items-start justify-start gap-1">
        <h1 className="text-3xl">
          {uppercaseFirstLetterOfEachSentence(poll.title)}
        </h1>
        {poll.description && (
          <h2>{uppercaseFirstLetterOfEachSentence(poll.description)}</h2>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
          <span>
            Created by{" "}
            <Link
              href={`/users/${poll.author.username}`}
              className={
                poll.anonymous && poll.authorId !== userId
                  ? "pointer-events-none"
                  : undefined
              }
            >
              {poll.author.username}
              {poll.anonymous && userId === poll.authorId && (
                <span className="text-sm italic"> (Anonymous)</span>
              )}
            </Link>
          </span>
          <span className="text-sm text-accent-foreground">
            on{" "}
            {poll.createdAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <PollCardActions
        poll={poll}
        showChart={true}
        showCommentsButton={false}
      />

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

  if (!poll) return {};

  const voteCounts: Record<string, number> = {};

  // Count votes for each option
  poll.votes.forEach((vote) => {
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

  const winningOption = poll.options.find(
    (option) => option.id === winningOptionId,
  );

  return {
    title: uppercaseFirstLetterOfEachSentence(poll.title),
    description: `Winning choice: "${winningOption?.text}"`,
  };
}
