"use client";

import { useUser } from "@clerk/nextjs";
import { handleVote } from "./actions";
import { toast } from "sonner";
import type { PollCardProps } from "./PollCard";

export function PollCardVoting(poll: PollCardProps & { userId: string }) {
  const { user } = useUser();

  const userVote = poll.votes.find((vote) => vote.userId === user?.id);

  async function onVote(optionId: string) {
    if (!user) {
      toast.warning("You need to be signed in to vote");
      return;
    }

    await handleVote({
      pollId: poll.id,
      optionId,
      userId: user?.id,
      voteId: userVote?.id,
    });
  }

  return (
    <ul className="divide-y divide-neutral-800">
      {poll.options.map((option) => (
        <li
          key={option.id}
          onClick={() => onVote(option.id)}
          className="flex cursor-pointer flex-row items-center gap-2 rounded-xl p-4 transition-colors hover:bg-neutral-900"
        >
          <div
            className={`h-4 w-4 rounded-full transition-colors
              ${userVote?.optionId === option.id ? "bg-purple-500" : "bg-neutral-700"}
            `}
          />
          <p className="text-sm text-neutral-200">{option.text}</p>
          <p className="ml-auto text-sm text-neutral-200">
            {poll.votes.filter((vote) => vote.optionId === option.id).length}
          </p>
        </li>
      ))}
    </ul>
  );
}
