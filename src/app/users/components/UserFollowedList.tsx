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
    <div>
      <h1>Following</h1>
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
