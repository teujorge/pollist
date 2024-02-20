import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { FollowButtonClient } from "./FollowButtonClient";

export async function FollowButton({ userId }: { userId: string }) {
  const { userId: myId } = auth();
  if (!myId) return null;

  const following = await db.follow.findUnique({
    where: {
      followerId_followedId: {
        followerId: myId,
        followedId: userId,
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
