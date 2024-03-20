"use client";

import { useState } from "react";
import { Loader } from "@/app/components/Loader";
import { follow, unfollow } from "@/app/(with-auth)/users/actions";
import { toast } from "sonner";

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
      try {
        await unfollow(userId);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to unfollow");
        }
      }
    } else {
      try {
        await follow(userId);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to follow");
        }
      }
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
