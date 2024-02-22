import type { User } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { PendingFollowerCardActions } from "./PendingFollowerCardActions";

export async function PendingFollowerCard({
  userId,
  follower,
}: {
  userId: string;
  follower: User;
}) {
  const { userId: myId } = auth();

  return (
    <div>
      {follower.username} wants to follow you...
      {myId === userId && <PendingFollowerCardActions follower={follower} />}
    </div>
  );
}
