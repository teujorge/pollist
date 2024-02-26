import { auth } from "@clerk/nextjs";
import { ActiveFollowerCardActions } from "./ActiveFollowerCardActions";
import type { User } from "@prisma/client";

export async function ActiveFollowerCard({
  userId,
  follower,
}: {
  userId: string;
  follower: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="flex flex-row items-center gap-2">
      <p>{follower.username}</p>
      {myId === userId && <ActiveFollowerCardActions follower={follower} />}
    </div>
  );
}
