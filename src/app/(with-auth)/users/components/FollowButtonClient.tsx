"use client";

import { useState } from "react";
import { Loader } from "@/app/components/Loader";
import { follow, unfollow } from "@/app/(with-auth)/users/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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

  if (isClicked)
    return (
      <div className="flex h-7 items-center justify-center pl-2">
        <Loader className="h-4 w-4 border-2" />
      </div>
    );

  return (
    <button
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "h-7 w-14 px-2 py-1",
      )}
      onClick={handleClick}
    >
      {isFollowing ? "unfollow" : "follow"}
    </button>
  );
}
