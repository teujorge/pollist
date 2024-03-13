import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { ProfileImage } from "@/app/components/ProfileImage";
import { ActiveFolloweeCardActions } from "./ActiveFolloweeCardActions";
import type { User } from "@prisma/client";

export async function ActiveFolloweeCard({
  userId,
  followed,
}: {
  userId: string;
  followed: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="flex w-full flex-row items-center justify-between gap-1">
      <Link
        className="flex flex-row items-center justify-center gap-1"
        href={`/users/${followed.id}`}
      >
        <ProfileImage
          src={followed.imageUrl}
          username={followed.username}
          size={20}
        />
        <p>{followed.username}</p>
      </Link>
      {myId === userId && <ActiveFolloweeCardActions followed={followed} />}
    </div>
  );
}
