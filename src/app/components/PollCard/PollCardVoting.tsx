"use client";

import { useUser } from "@clerk/nextjs";
import { getPoll, handleVote } from "./actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { PollsDetails } from "../InfinitePolls/actions";
import type { PollCardProps } from "./PollCard";

type PollCardVotingProps = PollCardProps & {
  usePolling?: boolean;
};

export function PollCardVoting(props: PollCardVotingProps) {
  const { user } = useUser();

  const [optimisticPoll, setOptimisticPoll] = useState<PollsDetails[number]>(
    props.poll,
  );

  const userVote = optimisticPoll.votes.find(
    (vote) => vote.voterId === user?.id,
  );

  const [isVotePending, setIsVotePending] = useState(false);

  // Poll every few seconds for updates
  useEffect(() => {
    if (isVotePending) return;
    if (!props.usePolling) return;

    const intervalMs = user?.id ? 5000 : 10000;

    const intervalId = setInterval(() => {
      console.log("Polling for updates");
      getPoll(optimisticPoll.id)
        .then((updatedPoll) => {
          console.log("Got updated poll:", updatedPoll);
          if (!updatedPoll) return;
          if (isVotePending) return;
          setOptimisticPoll((prev) => ({
            ...prev,
            ...updatedPoll,
          }));
        })
        .catch((error) => {
          toast.warning("Poll may be out of date");
          console.error("Error fetching poll:", error);
        });
    }, intervalMs);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isVotePending, optimisticPoll.id, props.usePolling, user?.id]);

  async function onVote(optionId: string) {
    if (!user) {
      toast.warning("You need to be signed in to vote");
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
        const prevVote = prev.votes.find((vote) => vote.voterId === user?.id);

        // If unvoting, remove the vote from the array
        const updatedVotes = prev.votes.filter(
          (vote) => vote.voterId !== user?.id,
        );

        // If voting, add the updated vote to the array
        if (idToSet) {
          const newVote = prevVote
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
        userId: user?.id,
        voteId: userVote?.id,
      });

      if (isUnVoting) return;
      setOptimisticPoll((prev) => {
        const newVotes = prev.votes.filter((vote) => vote.voterId !== user?.id);
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

  return (
    <>
      <ul className="divide-y divide-neutral-800">
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
              <div className={twMerge("relative flex cursor-pointer flex-row items-center gap-2 rounded-xl p-4 transition-colors hovact:bg-neutral-900 [&>div]:z-10 [&>p]:z-10 [&>span]:hovact:opacity-20", props.highlightOptionId === option.id && "border border-purple-500")>
                <span
                  className="absolute left-0 top-0 my-auto h-full rounded-xl bg-purple-500 opacity-10 transition-all"
                  style={{ width: `${votePercentage}%` }}
                />
                <div
                  className={`h-4 w-4 rounded-full transition-colors
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
    </>
  );
}
