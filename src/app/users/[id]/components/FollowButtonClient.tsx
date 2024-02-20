"use client";

import { useState } from "react";
import { follow, unfollow } from "../../actions";
import { Loader } from "@/app/components/Loader";

export function FollowButtonClient({
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

  if (isClicked) return <Loader className="h-7 w-7" />;

  return (
    <button
      className="h-fit w-fit rounded-lg bg-neutral-900 px-1.5 py-0.5 transition-colors hovact:bg-neutral-800"
      onClick={handleClick}
    >
      {isFollowing ? "unfollow" : "follow"}
    </button>
  );
}
