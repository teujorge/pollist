import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { ProfileImage } from "@/app/components/ProfileImage";
import { ActiveFolloweeCardActions } from "./ActiveFolloweeCardActions";
import type { User } from "@prisma/client";

export async function ActiveFolloweeCard({
  userId,
  followee,
}: {
  userId: string;
  followee: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="flex w-full flex-row items-center justify-between gap-1">
      <Link
        className="flex flex-row items-center justify-center gap-1"
        href={`/users/${followee.username}`}
      >
        <ProfileImage
          src={followee.imageUrl}
          username={followee.username}
          size={20}
        />
        <p>{followee.username}</p>
      </Link>
      {myId === userId && <ActiveFolloweeCardActions followed={followee} />}
    </div>
  );
}
