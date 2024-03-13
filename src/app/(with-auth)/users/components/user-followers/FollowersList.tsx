import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { Loader } from "@/app/components/Loader";
import { Suspense } from "react";
import { ActiveFollowerCard } from "./ActiveFollowerCard";

type FollowersListProps = {
  userId: string;
};

async function _FollowersList({ userId }: FollowersListProps) {
  const { userId: myId } = auth();
  console.log("followers -> userId", userId);

  const followers = await db.follow.findMany({
    where: {
      followeeId: userId,
      accepted: true,
    },
    select: {
      follower: true,
    },
  });

  console.log("followers -> followers", followers.length);

  return followers.length === 0 ? (
    <p className="text-sm text-neutral-400 underline underline-offset-4">
      {myId === userId
        ? "No one is following you yet."
        : "This user is not being followed by anyone yet."}
    </p>
  ) : (
    <div className="flex h-full w-full flex-col gap-1 overflow-y-auto">
      {followers.map((f) => (
        <ActiveFollowerCard
          key={f.follower.id}
          userId={userId}
          follower={f.follower}
        />
      ))}
    </div>
  );
}

export function FollowersList({ userId }: FollowersListProps) {
  return (
    <Suspense fallback={<Loader />}>
      <_FollowersList userId={userId} />
    </Suspense>
  );
}
