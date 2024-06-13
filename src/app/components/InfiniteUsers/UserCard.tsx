import Link from "next/link";
import DefaultImage from "~/public/default-profile-icon.webp";
import { ProfileImage } from "../ProfileImage";
import { FollowButtonClient } from "@/app/(with-auth)/users/components/FollowButtonClient";
import type { UsersDetails } from "./actions";

export function UserCard({
  userId,
  user,
}: {
  userId: string | null;
  user: UsersDetails[number];
}) {
  // followees & followers are undefined or an empty array or an array of "me" (myId)
  const iFollowUser = user.followees?.length > 0; // Checking if the current user is following the user
  const userFollowsMeAndAccepted = user.followers?.[0]?.accepted; // Checking if the user follows the current user and has accepted the follow request

  return (
    <div className="relative flex w-64 flex-col items-center gap-4 rounded-lg border border-accent bg-accent-dark2 p-6">
      <Link
        href={`/users/${user.username}`}
        className="flex flex-col items-center gap-2"
      >
        {/* User image and username */}
        <ProfileImage
          src={user.imageUrl ?? DefaultImage}
          username={undefined}
          size={96}
          className=""
        />
        <h3 className="text-lg font-bold">{user.username}</h3>
      </Link>

      {/* User stats */}
      <div className="text-center text-sm font-light text-accent-foreground">
        <span>{user._count.polls} polls</span>
        <strong> · </strong>
        <span>
          {user._count.votes} {user._count.votes === 1 ? "vote" : "votes"}
        </span>
        <br />
        {/* followers -> the followers of this user */}
        <span>{user._count.followers} following</span>
        <strong> · </strong>
        {/* followees -> the followees of this user */}
        <span>
          {user._count.followees}{" "}
          {user._count.followees === 1 ? "follower" : "followers"}
        </span>
      </div>

      {/* User actions */}
      {userId === user.id ? (
        <>
          {/* Caption at bottom corner saying this user is you */}
          <div className="absolute bottom-2 left-2 text-xs text-accent-foreground">
            You
          </div>
        </>
      ) : (
        <>
          {/* Actions (show only if signed in and user is not private) */}
          {userId && (
            <FollowButtonClient
              userId={user.id}
              isFollowing={iFollowUser}
              loadForever={false}
            />
          )}

          {/* Caption at bottom corner saying if this user follows you */}
          {userFollowsMeAndAccepted && (
            <div className="absolute bottom-2 left-2 text-xs text-accent">
              Follows you
            </div>
          )}
        </>
      )}
    </div>
  );
}
