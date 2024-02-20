import { db } from "@/database/db";
import { Tabs } from "./components/Tabs";
import { Stat } from "./components/Stat";
import { notFound } from "next/navigation";
import { ProfileImage } from "@/app/components/ProfileImage";
import { FollowButton } from "./components/FollowButton";
import { checkAndCreateAnonUser } from "@/app/api/anon/actions";
// import {
//   adminId,
//   createPollsFromList,
//   deleteAllPolls,
//   testCron,
// } from "@/database/defaultPolls";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
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
          following: true,
          followers: true,
        },
      },
    },
  });

  let anonId: string | undefined = undefined;
  if (!user) anonId = await checkAndCreateAnonUser();
  if (!user && !anonId) return notFound();

  return (
    <>
      <div className="flex w-full flex-row gap-8 rounded-xl border border-neutral-800 px-3 py-3">
        {user?.imageUrl ? (
          <ProfileImage
            src={user.imageUrl}
            alt={`${user.username ?? "Users's"} avatar`}
            width={100}
            height={100}
          />
        ) : (
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border border-neutral-800">
            <span className="select-none text-7xl">?</span>
          </div>
        )}

        <div className="flex min-h-full flex-col items-center justify-between">
          <h1 className="flex items-center justify-center">
            {user?.username ?? "Anon"}
          </h1>

          <Stat label="polls" count={user?._count?.polls ?? 0} />

          <Stat label="votes" count={user?._count?.votes ?? 0} />
        </div>

        {user?.anon === false && <FollowButton userId={params.id} />}

        <Stat label="following" count={user?._count?.following ?? 0} />

        <Stat label="followers" count={user?._count?.followers ?? 0} />

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
