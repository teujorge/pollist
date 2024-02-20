import { db } from "@/database/db";

export async function Following({ userId }: { userId: string }) {
  const following = await db.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followed: true,
    },
  });

  return (
    <div>
      <h1>Following</h1>
      <div>
        {following.map((f) => (
          <div key={f.followed.id}>{f.followed.username}</div>
        ))}
      </div>
    </div>
  );
}
