"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { LockSvg } from "@/app/svgs/LockSvg";
import { supabase } from "@/database/dbRealtime";
import { handleVote } from "./actions";
import { ChartDrawer } from "@/app/components/PollCard/ChartDrawer";
import { useEffect, useRef, useState } from "react";
import type { Vote } from "@prisma/client";
import type { PollsDetails } from "../InfinitePolls/actions";
import type { PollCardProps } from "./PollCard";
import type { RealtimeChannel } from "@supabase/realtime-js";
import type { MutableRefObject } from "react";

type PollCardVotingProps = PollCardProps & {
  showChart?: boolean;
};

export function PollCardVoting(props: PollCardVotingProps) {
  const { user } = useUser();

  const supabaseChannelRef: MutableRefObject<RealtimeChannel | undefined> =
    useRef();

  const [optimisticPoll, setOptimisticPoll] = useState<PollsDetails[number]>(
    props.poll,
  );

  const userVote = optimisticPoll.votes.find(
    (vote) => vote.voterId === user?.id,
  );

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
        toast.error(
          "An unknown error occurred while voting. Please try again.",
        );
      }

      console.error(error);
      setOptimisticPoll(prevPoll);
    } finally {
      setIsVotePending(false);
    }
  }

  const optionIdToHighlight = optimisticPoll.votes.find(
    (vote) => vote.voterId === props.highlightedUserId,
  )?.optionId;

  const voteBlocked = !user?.id;

  return (
    <div className="flex h-full w-full flex-grow flex-col pt-2 transition-opacity">
      {voteBlocked && (
        <div title="Sign in required to vote" className="ml-auto">
          <LockSvg className="fill-neutral-500" />
        </div>
      )}
      <ul
        title={voteBlocked ? "Sign in required to vote" : undefined}
        className={`divide-y divide-neutral-800
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
            <li key={option.id} onClick={() => onVote(option.id)}>
              <div
                className={cn(
                  "relative flex cursor-pointer flex-row items-center gap-2 rounded-xl border p-4 transition-colors hovact:bg-neutral-900 [&>div]:z-10 [&>p]:z-10 [&>span]:hovact:opacity-20",
                  option.id === optionIdToHighlight
                    ? "border-purple-500"
                    : "border-transparent",
                )}
              >
                <span
                  className="absolute left-0 top-0 h-full rounded-xl bg-neutral-500 opacity-10 transition-all"
                  style={{ width: `${votePercentage}%` }}
                />
                <div
                  className={`min-h-4 min-w-4 rounded-full transition-colors
                    ${userVote?.optionId === option.id ? "bg-purple-500" : "bg-neutral-700"}
                  `}
                />
                <p className="text-sm text-neutral-200">{option.text}</p>
                <p className="ml-auto text-sm text-neutral-200">
                  {
                    optimisticPoll.votes.filter(
                      (vote) => vote.optionId === option.id,
                    ).length
                  }
                </p>
              </div>
            </li>
          );
        })}
      </ul>
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

            return { value: optionVoteCounts };
          })}
        />
      )}
    </div>
  );
}
