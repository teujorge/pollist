import Link from "next/link";
import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { Tabs } from "@/app/users/components/Tabs";
import { Stat } from "@/app/users/components/Stat";
import { notFound } from "next/navigation";
import { getAnonUser } from "@/app/api/anon/actions";
import { ProfileImage } from "@/app/components/ProfileImage";
import { FollowButton } from "@/app/users/components/FollowButton";
import { getPendingFollows } from "../actions";

// import {
//   adminId,
//   createPollsFromList,
//   deleteAllPolls,
//   testCron,
// } from "@/database/defaultPolls";

export default async function UserPage({ params }: { params: { id: string } }) {
  const { userId: myId } = auth();

  const [user, totalPendingCount] = await Promise.all([
    // User data
    db.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        imageUrl: true,
        username: true,
        anon: true,
        _count: {
          select: {
            polls: true,
            votes: true,
            followers: { where: { accepted: true } },
            following: { where: { accepted: true } },
          },
        },
      },
    }),
    getPendingFollows(params.id),
  ]);

  let anonId: string | undefined = undefined;
  if (!user) anonId = (await getAnonUser())?.id;
  if (!user && !anonId) return notFound();

  return (
    <>
      <div className="flex w-full flex-row gap-8 rounded-xl border border-neutral-800 px-3 py-3">
        {user?.imageUrl ? (
          <ProfileImage
            src={user.imageUrl}
            username={user.username}
            size={100}
          />
        ) : (
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border border-neutral-800">
            <span className="select-none text-7xl">?</span>
          </div>
        )}

        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-2">
            <h1>{user?.username ?? "Anon"}</h1>
            {user?.anon === false && <FollowButton userId={params.id} />}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Stat label="polls" count={user?._count?.polls ?? 0} />

            <Stat label="votes" count={user?._count?.votes ?? 0} />

            <Link href={`/users/${params.id}/following`}>
              <Stat label="following" count={user?._count?.followers ?? 0} />
            </Link>

            <Link href={`/users/${params.id}/followers`}>
              <Stat label="followers" count={user?._count?.following ?? 0} />
            </Link>

            {myId === params.id && (
              <>
                <Link href={`/users/${params.id}/pending`}>
                  <Stat label="pending" count={totalPendingCount.length} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* !!! ADMIN USE ONLY !!! */}
        {/* {params.id === (await adminId()) && (
          <div>
            <form className="italic text-green-500" action={createPollsFromList}>
              <button>create default polls</button>
            </form>
            <form className="italic text-red-500" action={deleteAllPolls}>
              <button>delete all polls</button>
            </form>
            <form className="italic text-purple-500" action={testCron}>
              <button>test cron jobs</button>
            </form>
          </div>
        )} */}
      </div>
      <Tabs />
    </>
  );
}
