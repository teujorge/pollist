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
    <div className="flex flex-col items-center justify-between">
      <FollowButton
        key={`follow-${userId}-${iAmFollowingUser}`}
        userId={userId}
        isFollowing={iAmFollowingUser}
      />

      <div className="flex flex-row gap-8">
        <div className="flex flex-row items-center justify-center">
          <span className="font-bold">{followers.length}</span>
          <p>followers</p>
        </div>
        <div className="flex flex-row items-center justify-center">
          <span className="font-bold">{following.length}</span>
          <p>following </p>
        </div>
      </div>
    </div>
  );
}
