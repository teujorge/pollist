"use client";

import { useUserPage } from "../context";

export function Tabs() {
  const { tab, setTab } = useUserPage();

  return (
    <div className="sticky top-20 flex h-10 w-full flex-row justify-center">
      <button
        className={`z-10 w-40 rounded-lg p-2 transition-colors
          ${tab === "polls" ? "cursor-default font-bold text-white" : "text-neutral-400 hovact:bg-accent/40"}
        `}
        onClick={() => setTab("polls")}
      >
        Polls
      </button>

      <button
        className={`z-10 w-40 rounded-lg p-2 transition-colors
          ${tab === "votes" ? "cursor-default font-bold text-white" : "text-neutral-400 hovact:bg-accent/40"}
        `}
        onClick={() => setTab("votes")}
      >
        Votes
      </button>

      <div
        className={`absolute bottom-0 left-1/2 z-0 h-0.5 w-40 rounded-full bg-accent transition-all
          ${tab === "polls" ? "-translate-x-full" : ""}
        `}
      />
    </div>
  );
}
