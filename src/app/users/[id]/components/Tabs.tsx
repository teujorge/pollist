"use client";

import { useUserPage } from "../../context";

export function Tabs() {
  const { tab, setTab } = useUserPage();

  return (
    <div className="relative flex w-full flex-row justify-end rounded-xl border border-neutral-800 md:hidden">
      <button
        className={`z-10 w-full rounded-xl p-2 transition-colors ${tab === "polls" ? " font-bold text-black " : "text-white"}`}
        onClick={() => {
          setTab("polls");
        }}
      >
        Polls
      </button>

      <button
        className={`z-10 w-full rounded-xl p-2 transition-colors ${tab === "votes" ? "   font-bold text-black  " : "text-white"}`}
        onClick={() => {
          setTab("votes");
        }}
      >
        Votes
      </button>
      <div
        className={`absolute z-0 h-10 w-1/2 transition-transform ${tab === "polls" ? "-translate-x-full" : ""} rounded-xl  border border-neutral-800 bg-white`}
      />
    </div>
  );
}
