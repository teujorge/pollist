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
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="flex flex-row gap-2">
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold"> followers </p>
          <span className="text-neutral-300">{followers.length}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold"> following </p>
          <span className="text-neutral-300">{following.length}</span>
        </div>
      </div>
      <div className="flex-grow"></div>
      <FollowButton
        key={`follow-${userId}-${iAmFollowingUser}`}
        userId={userId}
        isFollowing={iAmFollowingUser}
      />
    </div>
  );
}
