"use client";

import { useState } from "react";
import { follow, unfollow } from "../../actions";
import { Loader } from "@/app/components/Loader";

export function FollowButton({
  userId,
  isFollowing,
}: {
  userId: string;
  isFollowing: boolean;
}) {
  const [isClicked, setIsClicked] = useState(false);

  async function handleClick() {
    setIsClicked(true);

    if (isFollowing) {
      await unfollow(userId);
    } else {
      await follow(userId);
    }
  }

  if (isClicked) return <Loader />;

  return (
    <button
      className={`h-20px w-20 rounded-xl border border-neutral-800 p-2 ${isFollowing ? "bg-red-500" : "bg-purple-500"} `}
      onClick={handleClick}
    >
      {isFollowing ? "unfollow" : "follow"}
    </button>
  );
}
