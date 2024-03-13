import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { Tabs } from "@/app/(with-auth)/users/components/Tabs";
import { Stat } from "@/app/(with-auth)/users/components/Stat";
import { notFound } from "next/navigation";
import { ProfileImage } from "@/app/components/ProfileImage";
import { FollowButton } from "@/app/(with-auth)/users/components/FollowButton";
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
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function UserPage({ params }: Props) {
  const userId = params.id;
  const { userId: myId } = auth();

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      imageUrl: true,
      username: true,
      _count: {
        select: {
          polls: true,
          votes: true,
          followers: { where: { accepted: true } },
          followees: { where: { accepted: true } },
        },
      },
    },
  });

  if (!user) return notFound();

  const followersCount = user._count?.followees ?? 0;
  const followingCount = user._count?.followers ?? 0;

  return (
    <>
      <div className="flex w-full flex-row gap-8 rounded-xl border border-accent px-3 py-3">
        <ProfileImage src={user.imageUrl} username={user.username} size={100} />

        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-2">
            <h1>{user.username}</h1>
            {myId && <FollowButton userId={userId} />}
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
                <FolloweesList userId={userId} />
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
                <FollowersList userId={userId} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <Tabs />
    </>
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      imageUrl: true,
      username: true,
    },
  });

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: user?.username,
    description: `${user?.username} user profile.`,
    openGraph: {
      images: user?.imageUrl
        ? [user.imageUrl, ...previousImages]
        : previousImages,
    },
  };
}
