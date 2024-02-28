"use client";

import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { declineFollow } from "../../actions";
import type { User } from "@prisma/client";

export function ActiveFollowerCardActions({ follower }: { follower: User }) {
  const [status, setStatus] = useState({ loading: false, complete: false });

  async function _declineFollow() {
    try {
      setStatus({ loading: true, complete: false });
      await declineFollow(follower.id);
      setStatus({ loading: false, complete: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel follow");
      setStatus({ loading: false, complete: false });
    }
  }

  return status.complete ? null : status.loading ? (
    <Loader className="h-4 w-4 border-2" />
  ) : (
    <button
      onClick={_declineFollow}
      className="rounded-lg border border-transparent bg-neutral-900 px-1.5"
    >
      <span className="text-red-500 underline decoration-transparent hovact:decoration-red-500">
        Remove
      </span>
    </button>
  );
}
