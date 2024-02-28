"use client";

import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { acceptFollow, declineFollow } from "../../actions";
import type { User } from "@prisma/client";

export async function PendingFollowerCardActions({
  follower,
}: {
  follower: User;
}) {
  const [status, setStatus] = useState({ loading: false, complete: false });

  async function _acceptFollow() {
    try {
      setStatus({ loading: true, complete: false });
      await acceptFollow(follower.id);
      setStatus({ loading: false, complete: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept follow");
      setStatus({ loading: false, complete: false });
    }
  }

  async function _declineFollow() {
    try {
      setStatus({ loading: true, complete: false });
      await declineFollow(follower.id);
      setStatus({ loading: false, complete: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline follow");
      setStatus({ loading: false, complete: false });
    }
  }

  return status.complete ? null : status.loading ? (
    <Loader className="h-4 w-4 border-2" />
  ) : (
    <>
      <button onClick={_acceptFollow}>
        <span className="text-green-500 underline decoration-transparent transition-colors hovact:decoration-green-500">
          Accept
        </span>
      </button>
      <button onClick={_declineFollow} className="pl-1">
        <span className="text-red-500 underline decoration-transparent transition-colors hovact:decoration-red-500">
          Decline
        </span>
      </button>
    </>
  );
}
