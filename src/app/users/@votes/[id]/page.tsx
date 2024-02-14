"use client";

import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";

import { useUserPage } from "../../context";

export default function MyVotes({ params }: { params: { id: string } }) {
  const { tab } = useUserPage();

  return (
    <div
      className={`w-full flex-grow flex-col gap-2 md:w-1/2
      ${tab === "votes" ? "flex" : "hidden md:flex"}
    `}
    >
      <div className="flex flex-col gap-2 overflow-y-auto rounded-xl border border-neutral-800 p-2">
        <InfinitePolls
          voterId={params.id}
          highlightedUserId={params.id}
          idPrefix="my-votes"
        />
      </div>
    </div>
  );
}
