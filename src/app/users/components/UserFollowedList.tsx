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

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1>Following</h1>
      <div className="w-full border"></div>
      <div>
        {following.map((f) => (
          <ActiveFollowedCard
            key={f.followed.id}
            userId={userId}
            followed={f.followed}
          />
        ))}
      </div>
    </div>
  );
}
