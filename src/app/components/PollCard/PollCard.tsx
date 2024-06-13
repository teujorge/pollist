"use client";

import Link from "next/link";
import AnonProfileImage from "~/public/default-profile-icon.webp";
import { useApp } from "@/app/(with-auth)/app";
import { ProfileImage } from "../ProfileImage";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import {
  cn,
  shouldShowSensitiveContent,
  uppercaseFirstLetterOfEachSentence,
} from "@/lib/utils";
import type { PollsDetails } from "../InfinitePolls/actions";

export type PollCardProps = {
  userId: string | null;
  poll: PollsDetails[number];
  highlightedUserId?: string;
  showCommentsButton?: boolean;
  className?: string;
};

export function PollCard({
  userId,
  poll,
  highlightedUserId,
  showCommentsButton = true,
  className,
}: PollCardProps) {
  const { userSettings, isUserBlocked } = useApp();

  const showContent = shouldShowSensitiveContent({
    userId: userId,
    contentCreatorId: poll.authorId,
    isContentSensitive: poll.sensitive,
    userViewsSensitiveContent: userSettings.viewSensitive,
  });

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border border-accent bg-accent-dark2 p-6 shadow-md",
        className,
      )}
    >
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
          <p className="text-foreground transition-colors">
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

      <Link
        href={`/polls/${poll.id}`}
        className={cn(
          "w-fit",
          (!showContent || isUserBlocked(poll.authorId)) && "redacted",
        )}
      >
        <h2 className="text-2xl font-bold">
          {uppercaseFirstLetterOfEachSentence(poll.title)}
        </h2>
      </Link>

      <PollCardActions
        poll={poll}
        isSensitiveContent={!showContent}
        highlightedUserId={highlightedUserId}
        showCommentsButton={showCommentsButton}
      />
    </div>
  );
}
