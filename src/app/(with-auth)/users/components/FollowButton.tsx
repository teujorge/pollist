import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { FollowButtonClient } from "./FollowButtonClient";

export async function FollowButton({ userId }: { userId: string }) {
  const { userId: myId } = auth();
  if (!myId) return null;
  if (myId === userId) return null;

  const following = await db.follow.findUnique({
    where: {
      followerId_followeeId: {
        followerId: myId,
        followeeId: userId,
      },
    },
  });

  const iAmFollowingUser = following !== null;

  return (
    <FollowButtonClient
      key={`${myId}-follows-${userId}-${iAmFollowingUser}`}
      userId={userId}
      isFollowing={iAmFollowingUser}
    />
  );
}
