"use client";

import { useUser } from "@clerk/nextjs";
import { getPoll, handleVote } from "./actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { PollDetails } from "./types";

type PollCardVotingProps = { poll: PollDetails; usePolling?: boolean };

export function PollCardVoting(props: PollCardVotingProps) {
  const { user } = useUser();

  const [ping, setPing] = useState(false);

  const [poll, setPoll] = useState<PollDetails>(props.poll);

  const userVote = poll.votes.find((vote) => vote.voterId === user?.id);

  const [isVotePending, setIsVotePending] = useState(false);

  const [optimisticVoteOptionId, setOptimisticVoteOptionId] = useState<
    string | undefined
  >(userVote?.optionId);

  // Poll every second for updates
  useEffect(() => {
    return; // TODO: for now no polling
    if (isVotePending) return;
    if (!props.usePolling) return;

    const intervalId = setInterval(() => {
      // console.log("Polling for updates");
      getPoll(poll.id)
        .then((updatedPoll) => {
          // console.log("Got updated poll:", updatedPoll);
          if (!updatedPoll) return;
          setPoll((prev) => ({
            ...prev,
            votes: updatedPoll.votes,
          }));
          setOptimisticVoteOptionId(
            updatedPoll.votes.find((vote) => vote.voterId === user?.id)
              ?.optionId,
          );
        })
        .catch((error) => {
          toast.warning("Poll may be out of date");
          console.error("Error fetching poll:", error);
        });
    }, 4000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isVotePending, poll.id, props.usePolling, user?.id]);

  useEffect(() => {
    setPing(true);
    const timer = setTimeout(() => setPing(false), 750);
    return () => clearTimeout(timer);
  }, [poll]);

  async function onVote(optionId: string) {
    if (!user) {
      toast.warning("You need to be signed in to vote");
      return;
    }

    try {
      setIsVotePending(true);

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
    } finally {
      setIsVotePending(false);
    }
  }

  return (
    <>
      <ul className="divide-y divide-neutral-800">
        {poll.options.map((option) => (
          <li key={option.id} onClick={() => onVote(option.id)}>
            <div className="hovact:bg-neutral-900 flex cursor-pointer flex-row items-center gap-2 rounded-xl p-4 transition-colors">
              <div
                className={`h-4 w-4 rounded-full transition-colors
              ${optimisticVoteOptionId === option.id ? "bg-purple-500" : "bg-neutral-700"}
            `}
              />
              <p className="text-sm text-neutral-200">{option.text}</p>
              <p className="ml-auto text-sm text-neutral-200">
                {
                  poll.votes.filter((vote) => vote.optionId === option.id)
                    .length
                }
              </p>
            </div>
          </li>
        ))}
      </ul>
      {props.usePolling && (
        <div
          className={`h-4 w-4 rounded-full bg-red-500 ${ping ? "animate-ping" : "opacity-0"}`}
        />
      )}
    </>
  );
}
