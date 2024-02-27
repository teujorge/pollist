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
    <div className="flex flex-col items-baseline justify-center rounded-lg border border-transparent bg-neutral-900 p-2">
      <p>
        waiting for <span className="font-extrabold">{followed.username} </span>
        to accept your follow request
      </p>
      {myId === userId && <PendingFollowedCardActions followed={followed} />}
    </div>
  );
}
