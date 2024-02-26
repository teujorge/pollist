import { auth } from "@clerk/nextjs";
import { PendingFollowerCardActions } from "./PendingFollowerCardActions";
import type { User } from "@prisma/client";

export async function PendingFollowerCard({
  userId,
  follower,
}: {
  userId: string;
  follower: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="flex flex-row items-center gap-2">
      <p>{follower.username} wants to follow you...</p>
      {myId === userId && <PendingFollowerCardActions follower={follower} />}
    </div>
  );
}
