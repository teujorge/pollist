import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { Loader } from "@/app/components/Loader";
import { Suspense } from "react";
import { ActiveFolloweeCard } from "./ActiveFolloweeCard";

type FolloweesListProps = {
  userId: string;
};

async function _FolloweesList({ userId }: FolloweesListProps) {
  const { userId: myId } = auth();

  const following = await db.follow.findMany({
    where: {
      followerId: userId,
      accepted: true,
    },
    select: {
      followee: true,
    },
  });

  return following.length === 0 ? (
    <p className="text-sm text-neutral-400 underline underline-offset-4">
      {myId === userId
        ? "You are not following anyone yet."
        : "This user is not following anyone yet."}
    </p>
  ) : (
    <div className="flex h-full w-full flex-col gap-1 overflow-y-auto">
      {following.map((f) => (
        <ActiveFolloweeCard
          key={f.followee.id}
          userId={userId}
          followee={f.followee}
        />
      ))}
    </div>
  );
}

export function FolloweesList({ userId }: FolloweesListProps) {
  return (
    <Suspense fallback={<Loader />}>
      <_FolloweesList userId={userId} />
    </Suspense>
  );
}
