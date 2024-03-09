import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { ActiveFollowerCardActions } from "./ActiveFollowerCardActions";
import { ProfileImage } from "@/app/components/ProfileImage";
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
    <div className="flex w-full flex-row items-center justify-between gap-1">
      <Link
        className="hovact:text-primary flex flex-row items-center justify-center gap-1"
        href={`/users/${follower.id}`}
      >
        <ProfileImage
          src={follower.imageUrl}
          username={follower.username}
          size={20}
        />
        <p>{follower.username}</p>
      </Link>
      {myId === userId && <ActiveFollowerCardActions follower={follower} />}
    </div>
  );
}
