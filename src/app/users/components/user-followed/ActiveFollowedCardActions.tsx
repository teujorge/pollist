"use client";

import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { unfollow } from "../../actions";
import type { User } from "@prisma/client";

export async function ActiveFollowedCardAction({
  followed,
}: {
  followed: User;
}) {
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  async function handleUnfollow() {
    setIsUnfollowing(true);
    try {
      await unfollow(followed.id);
    } catch (error) {
      setIsUnfollowing(false);
      console.error(error);
      toast.error("Failed to unfollow");
    }
  }

  return (
    <div className="flex h-9 w-fit items-center justify-center overflow-hidden">
      {isUnfollowing ? (
        <Loader className="h-4 w-4 border-2" />
      ) : (
        <button
          type="button"
          onClick={handleUnfollow}
          className="hovact:bg-destructive/25 flex items-center justify-center rounded-lg bg-neutral-900 px-2 py-1 transition-colors"
        >
          <span className="text-destructive">Unfollow</span>
        </button>
      )}
    </div>
  );
}
