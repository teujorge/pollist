import { auth } from "@clerk/nextjs/server";
import { Loader } from "@/app/components/Loader";
import { Suspense } from "react";
import { PAGE_SIZE } from "@/constants";
import { MoreFollowers } from "./MoreFollowers";
import { getMoreFollowers } from "./actions";
import { ActiveFollowerCard } from "./ActiveFollowerCard";

type FollowersListProps = {
  userId: string;
};

async function _FollowersList({ userId }: FollowersListProps) {
  const { userId: myId } = auth();

  const followers = await getMoreFollowers({
    userId: userId,
    cursor: undefined,
  });

  const cursor =
    followers.length === PAGE_SIZE
      ? followers[followers.length - 1]!.id
      : undefined;

  return followers.length === 0 ? (
    <p className="text-sm text-accent-foreground underline underline-offset-4">
      {myId === userId
        ? "No one is following you yet."
        : "This user is not being followed by anyone yet."}
    </p>
  ) : (
    <div className="flex h-full w-full flex-col gap-1 overflow-y-auto">
      {followers.map((follower) => (
        <ActiveFollowerCard
          key={follower.id}
          userId={userId}
          follower={follower}
        />
      ))}
      {cursor && <MoreFollowers userId={userId} initialCursor={cursor} />}
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
