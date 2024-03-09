import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { Tabs } from "@/app/(with-auth)/users/components/Tabs";
import { Stat } from "@/app/(with-auth)/users/components/Stat";
import { notFound } from "next/navigation";
import { ProfileImage } from "@/app/components/ProfileImage";
import { FollowButton } from "@/app/(with-auth)/users/components/FollowButton";
import { UserFollowedList } from "../components/UserFollowedList";
import { UserFollowersList } from "../components/UserFollowersList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ResolvingMetadata, Metadata } from "next";

// import {
//   adminId,
//   createPollsFromList,
//   deleteAllPolls,
//   testCron,
// } from "@/database/defaultPolls";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function UserPage({ params }: Props) {
  const { userId: myId } = auth();

  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      imageUrl: true,
      username: true,
      _count: {
        select: {
          polls: true,
          votes: true,
          followers: { where: { accepted: true } },
          following: { where: { accepted: true } },
        },
      },
    },
  });

  if (!user) return notFound();

  const followersCount = user._count?.following ?? 0;
  const followingCount = user._count?.followers ?? 0;

  return (
    <>
      <div className="flex w-full flex-row gap-8 rounded-xl border border-accent px-3 py-3">
        <ProfileImage src={user.imageUrl} username={user.username} size={100} />

        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-2">
            <h1>{user.username}</h1>
            {myId && <FollowButton userId={params.id} />}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Stat label="polls" count={user._count.polls} />
            <Stat label="votes" count={user._count.votes} />

            {myId ? (
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
                  <UserFollowedList userId={myId} />
                </DialogContent>
              </Dialog>
            ) : (
              <Stat label="following" count={followingCount} />
            )}

            {myId ? (
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
                  <UserFollowersList userId={myId} />
                </DialogContent>
              </Dialog>
            ) : (
              <Stat label="followers" count={followersCount} />
            )}
          </div>
        </div>

        {/* !!! ADMIN USE ONLY !!! */}
        {/* {params.id === (await adminId()) && (
          <div>
            <form className="italic text-green-500" action={createPollsFromList}>
              <button>create default polls</button>
            </form>
            <form className="italic text-destructive" action={deleteAllPolls}>
              <button>delete all polls</button>
            </form>
            <form className="italic text-primary" action={testCron}>
              <button>test cron jobs</button>
            </form>
          </div>
        )} */}
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
