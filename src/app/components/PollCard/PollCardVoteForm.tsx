"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import type { PollCardProps } from "./PollCard";
import { handleVote } from "./actions";

export function PollCardVoteForm(poll: PollCardProps & { userId: string }) {
  const { user } = useUser();

  const userVote = poll.votes.find((vote) => vote.userId === user?.id);

  async function onVote(optionId: string) {
    await handleVote({
      pollId: poll.id,
      optionId,
      userId: user?.id,
      voteId: userVote?.id,
    });
  }

  return (
    <form className="mt-4 space-y-4">
      {poll.options.map((option) => (
        <div key={option.id} className="flex items-center gap-2">
          <SignedIn>
            <div
              className={`h-4 w-4 cursor-pointer rounded-full  transition-colors 
                ${
                  userVote?.optionId === option.id
                    ? "bg-purple-500"
                    : "bg-neutral-700 hover:bg-neutral-600"
                }
              `}
              onClick={() => onVote(option.id)}
            />
          </SignedIn>
          <SignedOut>
            <div
              title="Sign in to vote!"
              className="h-4 w-4 rounded-full bg-neutral-800"
            />
          </SignedOut>
          <p className="text-sm text-neutral-200">{option.text}</p>
          <p className="ml-auto text-sm text-neutral-200">
            {poll.votes.filter((vote) => vote.optionId === option.id).length}
          </p>
        </div>
      ))}
    </form>
  );
}
