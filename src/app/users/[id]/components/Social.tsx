import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { FollowButton } from "./FollowButton";

export async function Social({ userId }: { userId: string }) {
  const { userId: myId } = auth();

  if (!myId) return null;

  const following = await db.follow.findMany({
    where: {
      followerId: myId,
    },
  });

  const followers = await db.follow.findMany({
    where: {
      followingId: myId,
    },
  });

  const iAmFollowingUser = following.some((f) => f.followingId === userId);

  return (
    <>
      <FollowButton
        key={`follow-${userId}-${iAmFollowingUser}`}
        userId={userId}
        isFollowing={iAmFollowingUser}
      />
      <>followers: {followers.length}</>
      <>following: {following.length}</>
    </>
  );
}
