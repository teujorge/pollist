import { db } from "@/database/db";
import { ActiveFollowerCard } from "./user-followers/ActiveFollowerCard";

export async function UserFollowersList({ userId }: { userId: string }) {
  console.log("followers -> userId", userId);

  const followers = await db.follow.findMany({
    where: {
      followedId: userId,
      accepted: true,
    },
    select: {
      follower: true,
    },
  });

  console.log("followers -> followers", followers.length);

  return followers.length === 0 ? (
    <p className="text-sm text-neutral-400 underline underline-offset-4">
      No one is following you yet!
    </p>
  ) : (
    <div className="gap flex flex-col gap-1">
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
