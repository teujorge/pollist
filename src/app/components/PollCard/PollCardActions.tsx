"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useApp } from "@/app/(with-auth)/app";
import { supabase } from "@/database/dbRealtime";
import { useEffect, useRef, useState } from "react";
import { LockClosedIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  acknowledgePollLike,
  handleLikePoll,
  handleUnlikePoll,
  handleVote,
} from "./actions";
import type { Vote } from "@prisma/client";
import type { PollsDetails } from "../InfinitePolls/actions";
import type { PollCardProps } from "./PollCard";
import type { RealtimeChannel } from "@supabase/realtime-js";
import type { MutableRefObject } from "react";

const ChartDrawer = dynamic(
  () => import("./ChartDrawer").then((mod) => mod.ChartDrawer),
  { ssr: false, loading: () => <div className="shimmer h-11 w-24" /> },
);

const TriggerNotificationSeen = dynamic(
  () =>
    import("../TriggerNotificationSeen").then(
      (mod) => mod.TriggerNotificationSeen,
    ),
  { ssr: false },
);

type PollCardActionsProps = PollCardProps & {
  showChart?: boolean;
};

export function PollCardActions(props: PollCardActionsProps) {
  const { user } = useUser();

  const { notifications } = useApp();

  const supabaseChannelRef: MutableRefObject<RealtimeChannel | undefined> =
    useRef();

  const [optimisticPoll, setOptimisticPoll] = useState<PollsDetails[number]>(
    props.poll,
  );

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
          filter: `pollId=eq.${props.poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const newPayload: Record<string, string> = payload.new;

          const newVote = {
            ...newPayload,
            createdAt: new Date(newPayload.createdAt ?? ""),
          } as Vote;

          console.log("Vote inserted:", newVote);
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
          filter: `pollId=eq.${props.poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const newPayload: Record<string, string> = payload.new;

          const newVote = {
            ...newPayload,
            createdAt: new Date(newPayload.createdAt ?? ""),
          } as Vote;
          if (!newVote) return;

          console.log("Vote updated:", newVote);
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
          filter: `pollId=eq.${props.poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const oldPayload: Record<string, string> = payload.old;

          const oldVote = {
            ...oldPayload,
            createdAt: new Date(oldPayload.createdAt ?? ""),
          } as Vote;

          console.log("Vote deleted:", oldVote);
          setOptimisticPoll((prev) => ({
            ...prev,
            votes: prev.votes.filter((vote) => vote.id !== oldVote.id),
          }));
        },
      )
      .subscribe();

    return () => void supabaseChannelRef.current?.unsubscribe();
  }, [user, props.poll.id, isVotePending, optimisticPoll.votes]);

  async function onVote(optionId: string) {
    if (!user?.id) {
      toast.warning("Sign in required to vote");
      return;
    }

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

      console.error(error);
      setOptimisticPoll(prevPoll);
    } finally {
      setIsVotePending(false);
    }
  }

  async function handleLike() {
    if (!user?.id) {
      toast.warning("Sign in required to like");
      return;
    }

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
        likes: prev._count.likes + (isLiking ? 1 : -1),
      },
    }));

    try {
      console.log("handleLikePoll", isLiking ? "like" : "unlike");
      if (isLiking) {
        await handleLikePoll({
          pollId: optimisticPoll.id,
          pollAuthorId: optimisticPoll.authorId,
        });
      } else {
        await handleUnlikePoll({ pollId: optimisticPoll.id });
      }
    } catch (error) {
      console.error(error);

      setOptimisticPoll((prev) => ({
        ...prev,
        likes: originalLikes,
        _count: {
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
    (vote) => vote.voterId === props.highlightedUserId,
  )?.optionId;

  const voteBlocked = !user?.id;

  const pollNotification = notifications.pollLikes.some(
    (n) => n.pollLike.pollId === optimisticPoll.id,
  );

  const likeButtonComponent = (
    <button
      className={`flex flex-row items-center justify-center gap-1 font-bold
        ${optimisticPoll.likes.length > 0 ? "[&>*]:text-primary [&>*]:hovact:text-purple-400" : "[&>*]:text-neutral-400 [&>*]:hovact:text-neutral-300"}
      `}
      onClick={user ? handleLike : undefined}
    >
      <ThickArrowUpIcon className="transition-colors" />
      <span className="transition-colors">{optimisticPoll._count.likes}</span>
    </button>
  );

  return (
    <div className="relative flex h-full w-full flex-grow flex-col gap-2 pt-2 transition-opacity">
      {voteBlocked && (
        <div
          title="Sign in required to vote"
          className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 text-neutral-400"
        >
          <LockClosedIcon />
        </div>
      )}

      <ul
        title={voteBlocked ? "Sign in required to vote" : undefined}
        className={`
          ${voteBlocked && "opacity-50"}
        `}
      >
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
              onClick={() => onVote(option.id)}
              className={cn(
                "relative flex w-full cursor-pointer flex-row items-center gap-2 rounded-xl border px-4 py-2 transition-colors hovact:bg-neutral-900",
                option.id === optionIdToHighlight
                  ? "border-primary"
                  : "border-transparent",
              )}
            >
              <div
                className={`max-h-4 min-h-4 min-w-4 max-w-4 rounded-full transition-colors
                    ${userVote?.optionId === option.id ? "bg-primary" : "bg-accent"}
                  `}
              />

              <div className="h-8 w-8 overflow-hidden rounded-lg object-cover">
                {option.imagePath && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/polls/${option.imagePath}`}
                    alt="option-image"
                    width={40}
                    height={40}
                  />
                )}
              </div>
              <div className="max-w-1/2">
                <p className="w-full flex-grow">{option.text}</p>
                <p className="whitespace-nowrap text-xs text-neutral-400">
                  {
                    optimisticPoll.votes.filter(
                      (vote) => vote.optionId === option.id,
                    ).length
                  }{" "}
                  Votes
                </p>
              </div>
              <div className="flex h-1 min-w-10 flex-grow rounded-full sm:bg-accent">
                <div
                  className="hidden h-full rounded-full bg-primary opacity-25 transition-all sm:flex"
                  style={{ width: `${votePercentage}%` }}
                />
              </div>
              <p className="w-10 text-end text-sm text-neutral-200">
                {votePercentage}%
              </p>
              <div className="h-8 w-8" />
            </li>
          );
        })}
      </ul>

      <div
        className={`relative w-fit rounded-full bg-opacity-20 px-2 py-1
          ${pollNotification && "bg-primary"}
        `}
      >
        <SignedIn>{likeButtonComponent}</SignedIn>
        <SignedOut>
          <SignInButton mode="modal">{likeButtonComponent}</SignInButton>
        </SignedOut>

        {pollNotification && (
          <TriggerNotificationSeen
            className="absolute left-0 top-0"
            acknowledgeFunction={async () => {
              console.log(optimisticPoll.id);
              await acknowledgePollLike({
                pollLikeId: optimisticPoll.likes[0]?.id ?? "",
              });
            }}
          />
        )}
      </div>

      {props.showChart && (
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
              label: option.text,
            };
          })}
        />
      )}
    </div>
  );
}
