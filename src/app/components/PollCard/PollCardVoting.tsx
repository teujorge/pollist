"use client";

import { useUser } from "@clerk/nextjs";
import { handleVote } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import type { PollDetails } from "./types";

type PollCardVotingProps = PollDetails & { authorId: string };

export function PollCardVoting(initialPoll: PollCardVotingProps) {
  const { user } = useUser();

  const [poll, setPoll] = useState<PollCardVotingProps>(initialPoll);

  const userVote = poll.votes.find((vote) => vote.voterId === user?.id);

  const [optimisticVoteOptionId, setOptimisticVoteOptionId] = useState<
    string | undefined
  >(userVote?.optionId);

  async function onVote(optionId: string) {
    if (!user) {
      toast.warning("You need to be signed in to vote");
      return;
    }

    try {
      const isUnVoting = userVote?.optionId === optionId;
      const idToSet = isUnVoting ? undefined : optionId;
      setOptimisticVoteOptionId(idToSet);

      const response = await handleVote({
        pollId: poll.id,
        optionId: idToSet,
        userId: user?.id,
        voteId: userVote?.id,
      });

      // Determine the new optionId based on the API response
      const newOptionId = isUnVoting ? undefined : response.optionId;

      setPoll((prev) => {
        const updatedVotes = prev.votes.filter(
          (vote) => vote.voterId !== user?.id,
        );

        // Add the new vote to the array if not unvoting
        if (newOptionId) {
          updatedVotes.push(response);
        }

        return {
          ...prev,
          votes: updatedVotes,
        };
      });

      setOptimisticVoteOptionId(newOptionId);
    } catch (error) {
      toast.error("Failed to vote");
      console.error(error);
      setOptimisticVoteOptionId(userVote?.optionId);
    }
  }

  return (
    <ul className="divide-y divide-neutral-800">
      {poll.options.map((option) => (
        <li key={option.id} onClick={() => onVote(option.id)}>
          <div className="flex cursor-pointer flex-row items-center gap-2 rounded-xl p-4 transition-colors hover:bg-neutral-900">
            <div
              className={`h-4 w-4 rounded-full transition-colors
              ${optimisticVoteOptionId === option.id ? "bg-purple-500" : "bg-neutral-700"}
            `}
            />
            <p className="text-sm text-neutral-200">{option.text}</p>
            <p className="ml-auto text-sm text-neutral-200">
              {poll.votes.filter((vote) => vote.optionId === option.id).length}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
