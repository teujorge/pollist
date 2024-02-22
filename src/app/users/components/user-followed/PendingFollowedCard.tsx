import { auth } from "@clerk/nextjs";
import { PendingFollowedCardActions } from "./PendingFollowedCardActions";
import type { User } from "@prisma/client";

export async function PendingFollowedCard({
  userId,
  followed,
}: {
  userId: string;
  followed: User;
}) {
  const { userId: myId } = auth();

  return (
    <p>
      waiting for {followed.username} to accept your follow...
      {myId === userId && <PendingFollowedCardActions followed={followed} />}
    </p>
  );
}
