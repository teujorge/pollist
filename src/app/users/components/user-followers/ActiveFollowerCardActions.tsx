"use client";

import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { declineFollow } from "../../actions";
import type { User } from "@prisma/client";

export function ActiveFollowerCardActions({ follower }: { follower: User }) {
  const [isDeclining, setIsDeclining] = useState(false);

  async function handleRemoveFollow() {
    setIsDeclining(true);
    try {
      await declineFollow(follower.id);
    } catch (error) {
      setIsDeclining(false);
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to decline follow");
      }
    }
  }

  return (
    <div className="flex h-9 w-fit items-center justify-center overflow-hidden">
      {isDeclining ? (
        <Loader className="h-4 w-4 border-2" />
      ) : (
        <button
          type="button"
          onClick={handleRemoveFollow}
          className="flex items-center justify-center rounded-lg bg-neutral-900 px-2 py-1 transition-colors hovact:bg-red-500/25"
        >
          <span className="text-red-500">Remove</span>
        </button>
      )}
    </div>
  );
}
