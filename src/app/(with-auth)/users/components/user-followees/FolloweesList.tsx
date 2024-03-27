import { auth } from "@clerk/nextjs/server";
import { Loader } from "@/app/components/Loader";
import { Suspense } from "react";
import { PAGE_SIZE } from "@/constants";
import { getMoreFollowees } from "./actions";
import { MoreFollowees } from "./MoreFollowees";
import { ActiveFolloweeCard } from "./ActiveFolloweeCard";

type FolloweesListProps = {
  userId: string;
};

async function _FolloweesList({ userId }: FolloweesListProps) {
  const { userId: myId } = auth();

  const followees = await getMoreFollowees({
    userId: userId,
    cursor: undefined,
  });

  const cursor =
    followees.length === PAGE_SIZE
      ? followees[followees.length - 1]!.id
      : undefined;

  return followees.length === 0 ? (
    <p className="text-sm text-accent-foreground underline underline-offset-4">
      {myId === userId
        ? "You are not following anyone yet."
        : "This user is not following anyone yet."}
    </p>
  ) : (
    <div className="flex h-full w-full flex-col gap-1 overflow-y-auto">
      {followees.map((followee) => (
        <ActiveFolloweeCard
          key={followee.id}
          userId={userId}
          followee={followee}
        />
      ))}
      {cursor && <MoreFollowees userId={userId} initialCursor={cursor} />}
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
