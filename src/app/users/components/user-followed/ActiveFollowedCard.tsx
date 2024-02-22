import { auth } from "@clerk/nextjs";
import { ActiveFollowedCardAction } from "./ActiveFollowedCardActions";
import type { User } from "@prisma/client";

export async function ActiveFollowedCard({
  userId,
  followed,
}: {
  userId: string;
  followed: User;
}) {
  const { userId: myId } = auth();

  return (
    <p>
      {followed.username}
      {myId === userId && <ActiveFollowedCardAction followed={followed} />}
    </p>
  );
}
