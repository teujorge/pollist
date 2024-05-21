import Link from "next/link";
import AnonProfileImage from "~/public/default-profile-icon.webp";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../../users/actions";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProfileImage } from "@/app/components/ProfileImage";
import { getSinglePoll } from "@/app/components/InfinitePolls/actions";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import {
  AllComments,
  AllCommentsFallback,
} from "@/app/components/Comments/AllComments";
import {
  cn,
  shouldShowSensitiveContent,
  uppercaseFirstLetterOfEachSentence,
} from "@/lib/utils";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function PollPage({ params, searchParams }: Props) {
  const poll = await getSinglePoll({ pollId: params.id });

  if (!poll) return notFound();

  const { userId } = auth();

  const user = await getUser(undefined, userId ?? undefined);

  const showContent = shouldShowSensitiveContent({
    userId: userId,
    contentCreatorId: poll.authorId,
    isContentSensitive: poll.sensitive,
    userViewsSensitiveContent: user?.viewSensitive,
  });

  return (
    <main className="relative flex min-h-[calc(100dvh-64px)] w-full flex-col gap-1">
      {/* header */}
      <div className="flex flex-col items-start justify-start gap-1">
        {/* author profile link */}
        <Link
          href={`/users/${poll.author.username}`}
          className={cn(
            "flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 pl-0 transition-all [&>div>p]:hovact:text-primary [&>div>span]:hovact:text-purple-600 [&>div]:hovact:border-[#d0b3f5]",
            poll.anonymous && poll.authorId !== userId && "pointer-events-none",
          )}
        >
          <div className="rounded-full border-[3px] border-background transition-colors">
            <ProfileImage
              src={
                poll.anonymous && poll.authorId !== userId
                  ? AnonProfileImage
                  : poll.author.imageUrl
              }
              username={poll.author.username}
              size={38}
            />
          </div>

          <div className="flex flex-col justify-center gap-0.5 border-0">
            <p className="hyphens-auto break-words text-foreground transition-colors">
              {poll.author.username}
              {poll.anonymous && userId === poll.authorId && (
                <span className="text-sm italic"> (Anonymous)</span>
              )}
            </p>
            <span className="text-xs text-accent-foreground transition-colors">
              {new Date(poll.createdAt).toLocaleDateString(undefined, {
                year: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </Link>

        {/* title & description */}
        <h1
          className={cn(
            "hyphens-auto break-words text-2xl font-semibold",
            !showContent && "redacted",
          )}
        >
          {uppercaseFirstLetterOfEachSentence(poll.title)}
        </h1>

        {poll.description && (
          <h2
            className={cn(
              "hyphens-auto break-words text-accent-foreground",
              !showContent && "redacted",
            )}
          >
            {uppercaseFirstLetterOfEachSentence(poll.description)}
          </h2>
        )}
      </div>

      {/* poll interaction */}
      <PollCardActions
        poll={poll}
        isSensitiveContent={!showContent}
        showChart={true}
        showCommentsButton={false}
      />

      {/* poll comments */}
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
