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
    <div className="flex flex-row items-center justify-center gap-1">
      <ProfileImage
        src={follower.imageUrl}
        username={follower.username}
        size={20}
      />
      <p className="flex gap-1">
        {follower.username}
        {myId === userId && <ActiveFollowerCardActions follower={follower} />}
      </p>
    </div>
  );
}
