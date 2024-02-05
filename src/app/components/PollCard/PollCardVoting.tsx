"use client";

import { useUser } from "@clerk/nextjs";
import { handleVote } from "./actions";
import { toast } from "sonner";
import type { PollDetails } from "./types";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PollCardVoting(poll: PollDetails & { authorId: string }) {
  const { user } = useUser();

  const [isExpanded, setIsExpanded] = useState(false);

  const gsapRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isExpanded) {
      gsap.to(gsapRef.current, { height: "auto", duration: 0.25 });
    } else {
      gsap.to(gsapRef.current, { height: 112, duration: 0.25 });
    }
  }, [isExpanded]);

  const userVote = poll.votes.find((vote) => vote.voterId === user?.id);

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
    <>
      <ul
        ref={gsapRef}
        className="h-28 divide-y divide-neutral-800 overflow-hidden"
      >
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
      <button onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? "collapse" : "expand"}
      </button>
    </>
  );
}
