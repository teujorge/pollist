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
          className="flex items-center justify-center rounded-lg bg-neutral-900 px-2 py-1 transition-colors hovact:bg-red-500/20"
        >
          <span className="text-red-500">Unfollow</span>
        </button>
      )}
    </div>
  );
}
