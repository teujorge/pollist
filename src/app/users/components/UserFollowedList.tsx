import { db } from "@/database/db";
import { ActiveFollowedCard } from "./user-followed/ActiveFollowedCard";

export async function UserFollowedList({ userId }: { userId: string }) {
  console.log("following -> userId", userId);

  const following = await db.follow.findMany({
    where: {
      followerId: userId,
      accepted: true,
    },
    select: {
      followed: true,
    },
  });

  console.log("following -> following", following.length);

  return following.length === 0 ? (
    <p className="text-sm text-neutral-400 underline underline-offset-4">
      You are not following anyone yet!
    </p>
  ) : (
    <div className="flex flex-col gap-1">
      {following.map((f) => (
        <ActiveFollowedCard
          key={f.followed.id}
          userId={userId}
          followed={f.followed}
        />
      ))}
    </div>
  );
}
