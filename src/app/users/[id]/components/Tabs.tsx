"use client";

import { useUserPage } from "../../context";

export function Tabs() {
  const { tab, setTab } = useUserPage();

  return (
    <div className=" flex w-fit flex-row justify-end rounded-xl   border border-neutral-800   md:hidden">
      <button
        className={`z-10 w-20 rounded-xl  p-2 transition-colors  ${tab === "polls" ? " font-bold text-black " : "text-white"}`}
        onClick={() => {
          setTab("polls");
        }}
      >
        Polls
      </button>

      <button
        className={`z-10 w-20 rounded-xl p-2 transition-colors ${tab === "votes" ? "   font-bold text-black  " : "text-white"}`}
        onClick={() => {
          setTab("votes");
        }}
      >
        Votes
      </button>
      <div
        className={`absolute  z-0 h-10 w-20 transition-transform   ${tab === "polls" ? "-translate-x-20" : ""} rounded-xl  border border-neutral-800 bg-white`}
      />
    </div>
  );
}
