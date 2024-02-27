import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { PendingFollowedCard } from "./user-followed/PendingFollowedCard";
import { PendingFollowerCard } from "./user-followers/PendingFollowerCard";

export async function UserPendingList({ userId }: { userId: string }) {
  const { userId: myId } = auth();
  if (myId !== userId) return notFound();

  console.log("pending -> userId", userId);

  const pending = await db.follow.findMany({
    where: {
      OR: [
        {
          followerId: userId,
          accepted: false,
        },
        {
          followedId: userId,
          accepted: false,
        },
      ],
    },
    select: {
      follower: true,
      followed: true,
    },
  });

  console.log("pending -> pending", pending.length);

  return (
    <div>
      <h1 className="py-2">Pending</h1>
      <div className="flex flex-col gap-2">
        {pending.map((p) =>
          p.followed.id === userId ? (
            <PendingFollowerCard
              key={p.follower.id}
              userId={userId}
              follower={p.follower}
            />
          ) : (
            <PendingFollowedCard
              key={p.follower.id}
              userId={userId}
              followed={p.followed}
            />
          ),
        )}
      </div>
    </div>
  );
}
