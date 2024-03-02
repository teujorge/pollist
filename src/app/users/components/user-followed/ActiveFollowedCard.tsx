import { auth } from "@clerk/nextjs";
import { ActiveFollowedCardAction } from "./ActiveFollowedCardActions";
import type { User } from "@prisma/client";
import { ProfileImage } from "@/app/components/ProfileImage";
import Link from "next/link";

export async function ActiveFollowedCard({
  userId,
  followed,
}: {
  userId: string;
  followed: User;
}) {
  const { userId: myId } = auth();

  return (
    <div className="gap- flex flex-row items-center justify-center gap-1">
      <Link
        className="flex flex-row items-center justify-center gap-1"
        href={""}
        // href={`/users/${followed.id}`}
      >
        <ProfileImage
          src={followed.imageUrl}
          username={followed.username}
          size={20}
        />
        <p>{followed.username}</p>
      </Link>
      {myId === userId && <ActiveFollowedCardAction followed={followed} />}
    </div>
  );
}
