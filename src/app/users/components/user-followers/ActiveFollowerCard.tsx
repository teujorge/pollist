import { auth } from "@clerk/nextjs";
import { ActiveFollowerCardActions } from "./ActiveFollowerCardActions";
import { ProfileImage } from "@/app/components/ProfileImage";
import type { User } from "@prisma/client";
import Link from "next/link";

export async function ActiveFollowerCard({
  userId,
  follower,
}: {
  userId: string;
  follower: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="flex flex-row items-center justify-center gap-1">
      <Link
        className="flex flex-row items-center justify-center gap-1 hovact:text-purple-500"
        href={""}
        // href={`/users/${follower.id}`}
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
