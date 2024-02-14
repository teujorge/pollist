import Image from "next/image";
import { Card } from "@/app/components/Card";
import { db } from "@/database/db";
import { UserStatistics } from "./components/UserStatistics";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) return { notFound: true };

  return (
    <Card className="flex w-36 max-w-36 flex-col items-center">
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

      <h1 className="flex items-center justify-center">{user.username}</h1>

      <UserStatistics />
    </Card>
  );
}
