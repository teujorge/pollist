import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { Tabs } from "@/app/(with-auth)/users/components/Tabs";
import { Stat } from "@/app/(with-auth)/users/components/Stat";
import { Loader } from "@/app/components/Loader";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PricingTable } from "../components/PricingTable";
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
import { GearIcon } from "@radix-ui/react-icons";

type Props = {
  params: { username: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function UserPage({ params }: Props) {
  const username = params.username;
  const { userId: myId } = auth();

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      imageUrl: true,
      username: true,
      private: true,
      tier: true,
      _count: {
        select: {
          polls: true,
          votes: true,
          followers: { where: { accepted: true } },
          followees: { where: { accepted: true } },
        },
      },
      followees: myId
        ? {
            where: {
              followerId: myId,
              accepted: true,
            },
          }
        : false,
    },
  });

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

  const followersCount = user._count?.followees ?? 0;
  const followingCount = user._count?.followers ?? 0;

  console.log(user.followees);

  const isContentPrivate = calcIsContentPrivate();

  return (
    <>
      <div className="flex w-full flex-row gap-8 px-3 py-3">
        <ProfileImage src={user.imageUrl} username={user.username} size={100} />

        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-2">
            <h1>{user.username}</h1>
            {myId === user.id && (
              <>
                {/* TODO: temporarily remove pricing table for prod deployment */}
                {/* {user.tier === "FREE" ? (
                  <PricingTable userId={user.id} />
                ) : (
                  <a
                    href={process.env.NEXT_PUBLIC_STRIPE_BILLING_URL ?? "/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[4px] bg-white px-2 text-xs text-accent hovact:text-accent"
                  >
                    {user.tier}
                  </a>
                )} */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button>
                      <GearIcon />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="flex w-72 flex-col">
                    <DialogHeader>
                      <DialogTitle>Profile Settings</DialogTitle>
                    </DialogHeader>
                    <p className="text-center">Coming soon!</p>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {myId && <FollowButton userId={user.id} />}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Stat label="polls" count={user._count.polls} />
            <Stat label="votes" count={user._count.votes} />

            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <Stat label="following" count={followingCount} />
                </button>
              </DialogTrigger>
              <DialogContent className="flex w-72 flex-col">
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                </DialogHeader>
                <FolloweesList userId={user.id} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <Stat label="followers" count={followersCount} />
                </button>
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
        <p className="mx-auto pt-28 text-neutral-400 underline underline-offset-4">
          User profile is private
        </p>
      ) : (
        <>
          <Tabs />
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
                query={{ authorId: user.id }}
                highlightedUserId={undefined}
              />
            </Suspense>
          </TabManagement>
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
                query={{ voterId: user.id }}
                highlightedUserId={user.id}
              />
            </Suspense>
          </TabManagement>
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
