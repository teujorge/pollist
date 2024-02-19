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
    <button onClick={handleClick}>{isFollowing ? "unfollow" : "follow"}</button>
  );
}
