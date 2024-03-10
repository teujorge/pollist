import { db } from "@/database/db";
import { ActiveFollowerCard } from "./user-followers/ActiveFollowerCard";

export async function UserFollowersList({ userId }: { userId: string }) {
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
      No one is following you yet!
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
