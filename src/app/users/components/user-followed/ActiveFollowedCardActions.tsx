"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { unfollow } from "../../actions";
import type { User } from "@prisma/client";

export async function ActiveFollowedCardAction({
  followed,
}: {
  followed: User;
}) {
  const router = useRouter();

  async function _unfollow() {
    try {
      await unfollow(followed.id);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unfollow");
    }
  }

  return (
    <button onClick={_unfollow}>
      <span className="text-red-500 underline decoration-transparent hovact:decoration-red-500">
        Unfollow?
      </span>
    </button>
  );
}
