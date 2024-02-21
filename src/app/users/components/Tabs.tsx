"use client";

import { useUserPage } from "../context";

export function Tabs() {
  const { tab, setTab } = useUserPage();

  return (
    <div className="relative flex w-full flex-row justify-end rounded-xl border border-neutral-800 md:hidden">
      <button
        className={`z-10 w-full rounded-xl p-2 transition-colors
          ${tab === "polls" ? "cursor-default font-bold text-white" : "text-neutral-400"}
        `}
        onClick={() => {
          setTab("polls");
        }}
      >
        Polls
      </button>

      <button
        className={`z-10 w-full rounded-xl p-2 transition-colors
          ${tab === "votes" ? "cursor-default font-bold text-white" : "text-neutral-400"}
        `}
        onClick={() => {
          setTab("votes");
        }}
      >
        Votes
      </button>
      <div
        className={`absolute top-1 z-0 h-8 w-1/2 rounded-lg bg-neutral-900 transition-all
          ${tab === "polls" ? "-right-1 -translate-x-full" : "right-1"}
        `}
      />
    </div>
  );
}
