"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { follow, unfollow } from "@/app/(with-auth)/users/actions";

export function UserCardFollowButton({
  userId,
  currentFollower,
}: {
  userId: string;
  currentFollower: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(currentFollower);

  async function toggleFollow() {
    const currentState = isFollowing;

    try {
      setIsFollowing(!currentState);
      if (isFollowing) {
        await unfollow(userId);
      } else {
        await follow(userId);
      }
    } catch (error) {
      setIsFollowing(currentState);
      toast.error("Failed to toggle follow status");
    }
  }

  return (
    <Button
      size="sm"
      variant={isFollowing ? "destructive" : "secondary"}
      onClick={toggleFollow}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
