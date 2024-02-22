"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { declineFollow } from "../../actions";
import type { User } from "@prisma/client";

export async function ActiveFollowerCardActions({
  follower,
}: {
  follower: User;
}) {
  const router = useRouter();

  async function _declineFollow() {
    try {
      await declineFollow(follower.id);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel follow");
    }
  }

  return (
    <button onClick={_declineFollow}>
      <span className="text-red-500 underline decoration-transparent hovact:decoration-red-500">
        Remove follower?
      </span>
    </button>
  );
}
