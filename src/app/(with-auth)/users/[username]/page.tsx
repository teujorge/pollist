import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { Tabs } from "@/app/(with-auth)/users/components/Tabs";
import { Stat } from "@/app/(with-auth)/users/components/Stat";
import { Loader } from "@/app/components/Loader";
import { getUser } from "../actions";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BlockButton } from "../components/BlockButton";
import { ProfileImage } from "@/app/components/ProfileImage";
import { FollowButton } from "@/app/(with-auth)/users/components/FollowButton";
import { InfinitePolls } from "@/app/components/InfinitePolls/InfinitePolls";
import { TabManagement } from "../components/TabManagement";
import { FolloweesList } from "../components/user-followees/FolloweesList";
import { FollowersList } from "../components/user-followers/FollowersList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ResolvingMetadata, Metadata } from "next";

type Props = {
  params: { username: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function UserPage({ params }: Props) {
  const username = params.username;
  const { userId: myId } = auth();

  const user = await getUser(username);

  if (!user?.id) return notFound();

  function calcIsContentPrivate() {
    // just for typescript :/
    if (!user) return true;

    // if user is not private, content is not private
    if (!user.private) return false;

    // if user is "me", content is not private
    if (myId === user.id) return false;

    // if I follow them, content is not private
    if (user.followees && user.followees.length > 0) return false;

    // otherwise content is private
    return true;
  }

  const followersCount = user._count?.followees ?? 0; // followees -> the followees of this user
  const followingCount = user._count?.followers ?? 0; // followers -> the followers of this user

  const isContentPrivate = calcIsContentPrivate();

  return (
    <>
      <div className="flex w-full flex-row gap-8 px-3 py-3">
        <ProfileImage src={user.imageUrl} username={user.username} size={100} />

        <div className="flex flex-col justify-around gap-2">
          <div className="flex items-center gap-2">
            <h1>{user.username}</h1>
            {myId && myId !== user.id && (
              <>
                <FollowButton userId={user.id} />
                <BlockButton user={user} />
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Stat
              label={user._count.polls === 1 ? "poll" : "polls"}
              count={user._count.polls}
            />
            <Stat
              label={user._count.votes === 1 ? "vote" : "votes"}
              count={user._count.votes}
            />

            <Dialog>
              <DialogTrigger>
                <Stat label="following" count={followingCount} />
              </DialogTrigger>
              <DialogContent className="flex w-72 flex-col">
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                </DialogHeader>
                <FolloweesList userId={user.id} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <Stat
                  label={followersCount === 1 ? "follower" : "followers"}
                  count={followersCount}
                />
              </DialogTrigger>
              <DialogContent className="flex w-72 flex-col">
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                </DialogHeader>
                <FollowersList userId={user.id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {isContentPrivate ? (
        <p className="mx-auto pt-28 text-accent-foreground underline underline-offset-4">
          User profile is private
        </p>
      ) : (
        <>
          <Tabs showPrivate={myId === user.id} />

          <TabManagement tabKey="votes">
            <Suspense
              fallback={
                <div className="flex w-full items-center justify-center pt-8">
                  <Loader />
                </div>
              }
            >
              <InfinitePolls
                idPrefix="my-votes"
                query={{ voterId: user.id, anonymous: "both" }}
                highlightedUserId={user.id}
              />
            </Suspense>
          </TabManagement>

          <TabManagement tabKey="polls">
            <Suspense
              fallback={
                <div className="flex w-full items-center justify-center pt-8">
                  <Loader />
                </div>
              }
            >
              <InfinitePolls
                idPrefix="my-polls"
                query={{
                  authorId: user.id,
                  anonymous: myId === user.id ? "both" : false,
                }}
                highlightedUserId={undefined}
              />
            </Suspense>
          </TabManagement>

          {myId === user.id && (
            <TabManagement tabKey="private">
              <Suspense
                fallback={
                  <div className="flex w-full items-center justify-center pt-8">
                    <Loader />
                  </div>
                }
              >
                <InfinitePolls
                  idPrefix="my-private-polls"
                  query={{ authorId: user.id, private: true }}
                  highlightedUserId={undefined}
                />
              </Suspense>
            </TabManagement>
          )}
        </>
      )}
    </>
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      imageUrl: true,
      username: true,
    },
  });

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: user?.username,
    description: `${user?.username}'s profile.`,
    openGraph: {
      images: user?.imageUrl
        ? [user.imageUrl, ...previousImages]
        : previousImages,
    },
  };
}
