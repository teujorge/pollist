"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { follow, unfollow } from "@/app/(with-auth)/users/actions";

export function FollowButtonClient({
  userId,
  isFollowing: _isFollowing,
  loadForever = true,
}: {
  userId: string;
  isFollowing: boolean;
  loadForever?: boolean;
}) {
  const queryClient = useQueryClient();

  const [isClicked, setIsClicked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(_isFollowing);

  async function handleClick() {
    setIsClicked(true);

    if (isFollowing) {
      try {
        await unfollow(userId);
        queryClient
          .invalidateQueries({ queryKey: ["all-users"] })
          .catch((error) => console.error(error));
      } catch (error) {
        toast.error("Failed to unfollow");
      }
    } else {
      try {
        await follow(userId);
        queryClient
          .invalidateQueries({ queryKey: ["all-users"] })
          .catch((error) => console.error(error));
      } catch (error) {
        toast.error("Failed to follow");
      }
    }

    if (!loadForever) {
      setIsClicked(false);
      setIsFollowing(!isFollowing);
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
      onMouseDown={handleClick}
    >
      {isFollowing ? "unfollow" : "follow"}
    </Button>
  );
}
