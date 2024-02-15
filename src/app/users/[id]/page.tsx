import Image from "next/image";
import { db } from "@/database/db";
import { UserStatistics } from "./components/UserStatistics";
import { Tabs } from "./components/Tabs";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) return { notFound: true };

  return (
    <div className="flex w-full flex-row  items-center  justify-between gap-2 rounded-xl border border-neutral-800 px-3 py-2">
      <div className="flex flex-col">
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.username ?? "Users's avatar"}
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div className="shimmer h-[100px] w-[100px] !rounded-full" />
        )}

        <h1 className="flex items-center justify-center">
          {user.username ?? "Anon"}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-4">
        <UserStatistics />
        <Tabs />
      </div>
    </div>
  );
}
