"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { follow, unfollow } from "@/app/(with-auth)/users/actions";

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
        toast.error("Failed to unfollow");
      }
    } else {
      try {
        await follow(userId);
      } catch (error) {
        toast.error("Failed to follow");
      }
    }
  }

  if (isClicked)
    return (
      <div className="flex h-7 items-center justify-center pl-2">
        <Loader className="h-4 w-4 border-2" />
      </div>
    );

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-7 px-2 py-1"
      onClick={handleClick}
    >
      {isFollowing ? "unfollow" : "follow"}
    </Button>
  );
}
