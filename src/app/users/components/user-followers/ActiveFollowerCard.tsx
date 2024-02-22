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
    <p>
      {follower.username}
      {myId === userId && <ActiveFollowerCardActions follower={follower} />}
    </p>
  );
}
