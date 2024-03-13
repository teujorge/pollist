import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { ProfileImage } from "@/app/components/ProfileImage";
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
    <div className="flex w-full flex-row items-center justify-between gap-1">
      <Link
        className="flex flex-row items-center justify-center gap-1 hovact:text-primary"
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
