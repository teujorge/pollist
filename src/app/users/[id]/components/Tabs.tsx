"use client";

import { useUserPage } from "../../context";

export function Tabs() {
  const { tab, setTab } = useUserPage();

  return (
    <div className="flex w-full flex-row  items-center  justify-between gap-2 rounded-xl border border-neutral-800 px-3 py-2 md:hidden">
      <button
        className={`${tab === "polls" ? "font-bold" : ""}`}
        onClick={() => {
          setTab("polls");
        }}
      >
        Polls
      </button>

      <button
        className={`${tab === "votes" ? "font-bold" : ""}`}
        onClick={() => {
          setTab("votes");
        }}
      >
        Votes
      </button>
    </div>
  );
}
