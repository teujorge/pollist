import { auth } from "@clerk/nextjs";
import { ActiveFollowerCardActions } from "./ActiveFollowerCardActions";
import type { User } from "@prisma/client";
import { ProfileImage } from "@/app/components/ProfileImage";
import { FollowButton } from "../FollowButton";

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
        src={follower.imageUrl ?? "public/profilleIcon.jpg"}
        alt={""}
        width={20}
        height={20}
      ></ProfileImage>
      <p>
        {follower.username}
        {myId === userId && <ActiveFollowerCardActions follower={follower} />}
      </p>
      {<FollowButton userId={follower.id} />}
    </div>
  );
}
