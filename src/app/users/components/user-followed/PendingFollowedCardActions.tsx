"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cancelFollow } from "../../actions";
import type { User } from "@prisma/client";

export async function PendingFollowedCardActions({
  followed,
}: {
  followed: User;
}) {
  const router = useRouter();

  async function _cancelFollow() {
    try {
      await cancelFollow(followed.id);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel follow");
    }
  }

  return (
    <button onClick={_cancelFollow}>
      <span className="text-red-500 underline decoration-transparent hovact:decoration-red-500">
        Cancel?
      </span>
    </button>
  );
}
