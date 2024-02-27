import type { User } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { PendingFollowerCardActions } from "./PendingFollowerCardActions";

export async function PendingFollowerCard({
  userId,
  follower,
}: {
  userId: string;
  follower: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="flex flex-col justify-center rounded-lg border border-transparent bg-neutral-900 p-2">
      <p>
        <span className="font-extrabold">{follower.username}</span> wants to
        follow you
        {myId === userId && <PendingFollowerCardActions follower={follower} />}
      </p>
    </div>
  );
}
