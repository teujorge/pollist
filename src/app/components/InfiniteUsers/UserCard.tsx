import Link from "next/link";
import Image from "next/image";
import DefaultImage from "~/public/default-profile-icon.webp";
import { UserCardFollowButton } from "./UserCardFollowButton";
import type { UsersDetails } from "./actions";

export function UserCard({
  userId,
  user,
}: {
  userId: string | null;
  user: UsersDetails[number];
}) {
  const iFollowUser = user.followers?.length > 0;
  const userFollowsMe = user.followees?.length > 0;

  return (
    <div className="relative flex w-64 flex-col items-center gap-4 rounded-lg border border-accent bg-accent-dark2 p-8">
      <Link
        href={`/users/${user.username}`}
        className="flex flex-col items-center gap-2"
      >
        {/* User image and details */}
        <Image
          src={user.imageUrl ?? DefaultImage}
          alt="User Avatar"
          width={96}
          height={96}
          className="rounded-full object-cover"
        />
        <h3 className="text-lg font-bold">{user.username}</h3>
      </Link>
      <div>
        <div className="text-center text-sm font-light text-accent-foreground">
          <span>{user._count.polls} polls</span>
          <strong> · </strong>
          <span>{user._count.votes} votes</span>
          <br />
          <span>{user._count.followers} followers</span>
          <strong> · </strong>
          <span>{user._count.followees} following</span>
        </div>
      </div>

      {userId === user.id ? (
        <>
          {/* Caption at bottom corner saying this is you */}
          <div className="absolute bottom-2 left-2 text-xs text-accent">
            You
          </div>
        </>
      ) : (
        <>
          {/* Actions (show only if signed in and user is not private) */}
          {userId && (
            <UserCardFollowButton
              userId={user.id}
              currentFollower={iFollowUser}
            />
          )}

          {/* Caption at bottom corner saying if this user follows you */}
          {userFollowsMe && (
            <div className="absolute bottom-2 left-2 text-xs text-accent">
              Follows you
            </div>
          )}
        </>
      )}
    </div>
  );
}
