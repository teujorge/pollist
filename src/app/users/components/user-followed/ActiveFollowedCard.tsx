import { auth } from "@clerk/nextjs";
import { ActiveFollowedCardAction } from "./ActiveFollowedCardActions";
import type { User } from "@prisma/client";
import { ProfileImage } from "@/app/components/ProfileImage";

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
      <ProfileImage
        src={followed.imageUrl}
        username={followed.username}
        size={20}
      />
      <p className="flex gap-1">
        {followed.username}
        {myId === userId && <ActiveFollowedCardAction followed={followed} />}
      </p>
    </div>
  );
}
