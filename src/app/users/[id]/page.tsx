import { db } from "@/database/db";
import { Tabs } from "./components/Tabs";
import { ProfileImage } from "@/app/components/ProfileImage";
import { UserStatistics } from "./components/UserStatistics";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) return { notFound: true };

  return (
    <div className="flex w-full flex-row   justify-between gap-2 rounded-xl border border-neutral-800 px-3 py-2">
      <div className="flex flex-col gap-2">
        {user.imageUrl ? (
          <ProfileImage
            src={user.imageUrl}
            alt={`${user.username ?? "Users's"} avatar`}
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border border-neutral-800">
            <span className="select-none text-7xl">?</span>
          </div>
        )}

        <h1 className="flex items-center justify-center">
          {user.username ?? "Anon"}
        </h1>
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
        </div>
      )} */}

      <div className="flex min-h-full  flex-col justify-between gap-4">
        <UserStatistics />
        <Tabs />
      </div>
    </div>
  );
}
