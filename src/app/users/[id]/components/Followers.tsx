import { db } from "@/database/db";

export async function Followers({ userId }: { userId: string }) {
  const followers = await db.follow.findMany({
    where: {
      followedId: userId,
    },
    select: {
      follower: true,
    },
  });

  return (
    <div>
      <h1>Followers</h1>
      <div>
        {followers.map((f) => (
          <div key={f.follower.id}>{f.follower.username}</div>
        ))}
      </div>
    </div>
  );
}
