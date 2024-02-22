import { db } from "@/database/db";
import { ActiveFollowerCard } from "./user-followers/ActiveFollowerCard";

export async function USerFollowersList({ userId }: { userId: string }) {
  console.log("followers -> userId", userId);

  const followers = await db.follow.findMany({
    where: {
      followedId: userId,
    },
    select: {
      follower: true,
    },
  });

  console.log("followers -> followers", followers.length);

  return (
    <div>
      <h1>Followers</h1>
      <div>
        {followers.map((f) => (
          <ActiveFollowerCard
            key={f.follower.id}
            userId={userId}
            follower={f.follower}
          />
        ))}
      </div>
    </div>
  );
}
