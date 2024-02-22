"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { acceptFollow, declineFollow } from "../../actions";
import type { User } from "@prisma/client";

export async function PendingFollowerCardActions({
  follower,
}: {
  follower: User;
}) {
  const router = useRouter();

  async function _acceptFollow() {
    try {
      await acceptFollow(follower.id);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept follow");
    }
  }

  async function _declineFollow() {
    try {
      await declineFollow(follower.id);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline follow");
    }
  }

  return (
    <div>
      <button onClick={_acceptFollow}>
        <span className="text-green-500 underline decoration-transparent transition-colors hovact:decoration-green-500">
          Accept
        </span>
      </button>
      <button onClick={_declineFollow}>
        <span className="text-red-500 underline decoration-transparent transition-colors hovact:decoration-red-500">
          Decline
        </span>
      </button>
    </div>
  );
}
