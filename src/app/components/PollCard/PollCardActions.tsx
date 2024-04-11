"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useApp } from "@/app/(with-auth)/app";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/database/supabase";
import { SharePopover } from "../SharePopover";
import { PopoverClose } from "@radix-ui/react-popover";
import { DeletePollForm } from "../CrudPoll/DeletePollForm";
import { CircularProgress } from "../CircularProgress";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  formatNumber,
  uppercaseFirstLetterOfEachSentence,
} from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  handleVote,
  handleLikePoll,
  handleUnlikePoll,
  acknowledgePollLike,
} from "./actions";
import {
  Star,
  Warning,
  DotsThree,
  ArrowFatUp,
  ChatTeardropText,
} from "@phosphor-icons/react";
import type { Vote } from "@prisma/client";
import type { PollsDetails } from "../InfinitePolls/actions";
import type { PollCardProps } from "./PollCard";
import type { RealtimeChannel } from "@supabase/realtime-js";
import type { MutableRefObject } from "react";

const ChartDrawer = dynamic(
  () => import("./ChartDrawer").then((mod) => mod.ChartDrawer),
  { ssr: false, loading: () => <div className="shimmer h-9 w-full" /> },
);

const TriggerNotificationSeen = dynamic(
  () =>
    import("../TriggerNotificationSeen").then(
      (mod) => mod.TriggerNotificationSeen,
    ),
  { ssr: false },
);

type PollCardActionsProps = Omit<PollCardProps, "userId"> & {
  showChart?: boolean;
  blurContent: boolean;
};

export function PollCardActions({
  poll,
  blurContent,
  highlightedUserId,
  showChart,
  showCommentsButton,
}: PollCardActionsProps) {
  const { user } = useUser();

  const { notifications } = useApp();

  const supabaseChannelRef: MutableRefObject<RealtimeChannel | undefined> =
    useRef();

  const [optimisticPoll, setOptimisticPoll] =
    useState<PollsDetails[number]>(poll);

  const userVote = optimisticPoll.votes.find(
    (vote) => vote.voterId === user?.id,
  );

  const [isLikePending, setIsLikePending] = useState(false);
  const [isVotePending, setIsVotePending] = useState(false);

  // Subscribe to changes in the database
  useEffect(() => {
    supabaseChannelRef.current = supabase
      ?.channel(`${user?.id}-votes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Vote",
          filter: `pollId=eq.${poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const newPayload: Record<string, string> = payload.new;

          const newVote = {
            ...newPayload,
            createdAt: new Date(newPayload.createdAt ?? ""),
          } as Vote;

          if (optimisticPoll.votes.some((vote) => vote.id === newVote.id)) {
            return;
          }
          setOptimisticPoll((prev) => ({
            ...prev,
            votes: [...prev.votes, newVote],
          }));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Vote",
          filter: `pollId=eq.${poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const newPayload: Record<string, string> = payload.new;

          const newVote = {
            ...newPayload,
            createdAt: new Date(newPayload.createdAt ?? ""),
          } as Vote;
          if (!newVote) return;

          setOptimisticPoll((prev) => ({
            ...prev,
            votes: prev.votes.map((vote) =>
              vote.id === newVote.id ? newVote : vote,
            ),
          }));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "Vote",
          filter: `pollId=eq.${poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const oldPayload: Record<string, string> = payload.old;

          const oldVote = {
            ...oldPayload,
            createdAt: new Date(oldPayload.createdAt ?? ""),
          } as Vote;

          setOptimisticPoll((prev) => ({
            ...prev,
            votes: prev.votes.filter((vote) => vote.id !== oldVote.id),
          }));
        },
      )
      .subscribe();

    return () => void supabaseChannelRef.current?.unsubscribe();
  }, [user, poll.id, isVotePending, optimisticPoll.votes]);

  async function onVote(optionId: string) {
    if (!user?.id) return;

    if (isVotePending) {
      toast.warning("Vote pending, please wait");
      return;
    }

    // Save the current poll state to revert to if the vote fails
    const prevPoll = optimisticPoll;

    try {
      setIsVotePending(true);

      const isUnVoting = userVote?.optionId === optionId;
      const idToSet = isUnVoting ? undefined : optionId;

      setOptimisticPoll((prev) => {
        // Get users current vote
        const prevVote = prev.votes.find((vote) => vote.voterId === user.id);

        // If un-voting, remove the vote from the array
        const updatedVotes = prev.votes.filter(
          (vote) => vote.voterId !== user.id,
        );

        // If voting, add the updated vote to the array
        if (idToSet) {
          const newVote: typeof prevVote = prevVote
            ? {
                ...prevVote,
                optionId: idToSet,
              }
            : {
                id: "optimistic-vote-id",
                createdAt: new Date(),
                voterId: user.id,
                pollId: optimisticPoll.id,
                optionId: idToSet,
              };

          updatedVotes.push(newVote);
        }

        return {
          ...prev,
          votes: updatedVotes,
        };
      });

      const dbVote = await handleVote({
        pollId: optimisticPoll.id,
        optionId: idToSet,
        userId: user.id,
        voteId: userVote?.id,
      });

      if (isUnVoting) return;
      setOptimisticPoll((prev) => {
        const newVotes = prev.votes.filter((vote) => vote.voterId !== user.id);
        newVotes.push(dbVote);
        return { ...prev, votes: newVotes };
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while voting. Please try again.");
      }

      setOptimisticPoll(prevPoll);
    } finally {
      setIsVotePending(false);
    }
  }

  async function handleLike() {
    if (!user?.id) return;

    if (isLikePending) {
      toast.warning("Like pending, please wait");
      return;
    }

    setIsLikePending(true);

    const isLiking = !optimisticPoll.likes.some(
      (like) => like.authorId === user.id,
    );

    const originalLikeCount = optimisticPoll._count.likes;
    const originalLikes = optimisticPoll.likes;

    setOptimisticPoll((prev) => ({
      ...prev,
      likes: isLiking
        ? [
            {
              id: "optimistic-like-id",
              createdAt: new Date(),
              authorId: user.id,
              pollId: optimisticPoll.id,
            },
          ]
        : [],
      _count: {
        comments: prev._count.comments,
        likes: prev._count.likes + (isLiking ? 1 : -1),
      },
    }));

    try {
      if (isLiking) {
        await handleLikePoll({
          pollId: optimisticPoll.id,
          pollAuthorId: optimisticPoll.authorId,
        });
      } else {
        await handleUnlikePoll({ pollId: optimisticPoll.id });
      }
    } catch (error) {
      setOptimisticPoll((prev) => ({
        ...prev,
        likes: originalLikes,
        _count: {
          comments: prev._count.comments,
          likes: originalLikeCount,
        },
      }));

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while liking. Please try again.");
      }
    }

    setIsLikePending(false);
  }

  const optionIdToHighlight = optimisticPoll.votes.find(
    (vote) => vote.voterId === highlightedUserId,
  )?.optionId;

  const pollNotification = notifications.pollLikes.some(
    (n) => n.pollLike.poll.id === optimisticPoll.id,
  );

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-lg border border-accent bg-background p-2 text-center sm:gap-4 sm:p-4",
          !blurContent && "hidden",
        )}
      >
        <SignedIn>
          <p className="text-sm text-accent-foreground">
            This poll contains sensitive content.
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              const userButton = document.querySelector(
                "button.cl-userButtonTrigger",
              );
              if (userButton) (userButton as HTMLButtonElement).click();

              await new Promise((resolve) => setTimeout(resolve, 200));

              const manageAccountButton = document.querySelector(
                "button.cl-userButtonPopoverActionButton__manageAccount",
              );
              if (manageAccountButton) {
                (manageAccountButton as HTMLButtonElement).click();
              }
            }}
          >
            Show content
          </Button>
        </SignedIn>
        <SignedOut>
          <p className="text-sm text-accent-foreground">
            This poll contains sensitive content.{" "}
            <span className="font-semibold text-foreground">Sign in</span> to
            view the content.
          </p>
          <SignInButton mode="modal">
            <Button variant="secondary">Show content</Button>
          </SignInButton>
        </SignedOut>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full flex-grow flex-col gap-2 pt-2",
          blurContent && "pointer-events-none select-none blur-sm",
        )}
      >
        <ul>
          {optimisticPoll.options.map((option) => {
            const votePercentage =
              optimisticPoll.votes.length === 0
                ? 0
                : Math.round(
                    (optimisticPoll.votes.filter(
                      (vote) => vote.optionId === option.id,
                    ).length /
                      optimisticPoll.votes.length) *
                      100,
                  );

            return (
              <li
                key={option.id}
                onClick={user ? () => onVote(option.id) : undefined}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border p-2 transition-colors hovact:bg-accent/30 sm:p-4",
                  option.id === optionIdToHighlight
                    ? "border-primary"
                    : "border-transparent",
                )}
              >
                <div className="flex w-full flex-row items-center gap-2">
                  {/* user selection dot */}
                  <div
                    className={`max-h-4 min-h-4 min-w-4 max-w-4 rounded-full transition-colors
                    ${userVote?.optionId === option.id ? "bg-primary" : "bg-accent"}
                  `}
                  />

                  {/* option text */}
                  <div className="w-full flex-grow">
                    <p>{uppercaseFirstLetterOfEachSentence(option.text)}</p>
                    <p className="whitespace-nowrap text-xs text-accent-foreground">
                      {
                        optimisticPoll.votes.filter(
                          (vote) => vote.optionId === option.id,
                        ).length
                      }{" "}
                      Votes
                    </p>
                  </div>

                  {/* vote percentage */}
                  <CircularProgress size={40} progress={votePercentage} />
                </div>

                {/* optional option image */}
                {option.imagePath && (
                  <div className="overflow-hidden rounded-lg object-cover">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/polls/${option.imagePath}`}
                      alt="option-image"
                      width={400}
                      height={400}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div
            className={`relative w-fit rounded-full bg-opacity-20 px-2 py-1
          ${pollNotification && "bg-primary"}
        `}
          >
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "flex flex-row items-center justify-center gap-1 font-bold",
                (optimisticPoll.likes?.length ?? 0) > 0 &&
                  "[&>*]:text-primary [&>*]:hovact:text-purple-400",
              )}
              onClick={user ? handleLike : undefined}
            >
              <ArrowFatUp size={20} />
              <span className="transition-colors">
                {optimisticPoll._count.likes}
              </span>
            </Button>

            {pollNotification && (
              <TriggerNotificationSeen
                className="absolute left-0 top-0"
                acknowledgeFunction={async () => {
                  await acknowledgePollLike({
                    pollLikeId: optimisticPoll.likes[0]?.id ?? "",
                  });
                }}
              />
            )}
          </div>

          <div className="flex flex-row">
            {showCommentsButton && (
              <Link
                href={`/polls/${poll.id}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "flex flex-row items-center justify-center gap-2 font-bold transition-colors",
                )}
              >
                <span>{formatNumber(poll._count.comments)}</span>
                <ChatTeardropText size={20} />
              </Link>
            )}

            <SharePopover text={poll.title} pathname={"/polls/" + poll.id} />

            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                  <DotsThree size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="py-2">
                <PopoverClose asChild>
                  <Link
                    href={`/polls/${poll.id}/boost`}
                    className={cn(
                      buttonVariants({ variant: "popover" }),
                      "hovact:bg-primary/20 hovact:text-primary",
                    )}
                  >
                    <Star size={15} />
                    Boost this poll
                  </Link>
                </PopoverClose>
                {user?.id === poll.authorId ? (
                  <DeletePollForm poll={poll} />
                ) : (
                  <Button
                    variant="popover"
                    className="hovact:bg-yellow-500/20 hovact:text-yellow-500"
                    onClick={() => {
                      toast.warning("Feature coming soon");
                    }}
                  >
                    <Warning size={15} />
                    Report
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {showChart && (
          <ChartDrawer
            data={optimisticPoll.options.map((option) => {
              const optionVoteCounts =
                optimisticPoll.votes.length === 0
                  ? 0
                  : Math.round(
                      optimisticPoll.votes.filter(
                        (vote) => vote.optionId === option.id,
                      ).length,
                    );

              return {
                value: optionVoteCounts,
                label: uppercaseFirstLetterOfEachSentence(option.text),
              };
            })}
          />
        )}
      </div>
    </div>
  );
}
