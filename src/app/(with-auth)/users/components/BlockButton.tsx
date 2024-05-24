"use client";

import { toast } from "sonner";
import { useApp } from "../../app";
import { Button } from "@/components/ui/button";
import { Loader } from "@/app/components/Loader";
import { useState } from "react";
import { blockUser, unblockUser } from "@/app/(with-auth)/users/actions";

export function BlockButton({
  user,
}: {
  user: { id: string; username: string; imageUrl: string | null };
}) {
  const { isUserBlocked, setBlockedUsers } = useApp();

  const [isClicked, setIsClicked] = useState(false);

  async function handleClick() {
    setIsClicked(true);

    if (isUserBlocked(user.id)) {
      setBlockedUsers((prev) =>
        prev.filter((blockedUser) => blockedUser.id !== user.id),
      );
      try {
        await unblockUser(user.id);
      } catch (error) {
        toast.error("Failed to unblock user");
        setBlockedUsers((prev) => [
          ...prev,
          {
            id: user.id,
            username: user.username,
            imageUrl: user.imageUrl,
          },
        ]);
      }
    } else {
      setBlockedUsers((prev) => [
        ...prev,
        {
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl,
        },
      ]);
      try {
        await blockUser(user.id);
      } catch (error) {
        toast.error("Failed to block user");
        setBlockedUsers((prev) => prev.filter((user) => user.id !== user.id));
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
    <Button
      size="sm"
      variant="outline"
      className="h-7 px-2 py-1"
      onMouseDown={handleClick}
    >
      {isUserBlocked(user.id) ? "unblock" : "block"}
    </Button>
  );
}
