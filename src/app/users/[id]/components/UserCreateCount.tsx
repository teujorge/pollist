import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";

export async function UserCreateCount() {
  const { userId } = auth();

  if (!userId) return null;

  const createCount = db.poll.count({
    where: {
      authorId: userId,
    },
  });

  return (
    <p className="flex flex-col items-center ">
      <span className="font-semibold">Creations </span>
      <span className="text-neutral-300">{createCount}</span>
    </p>
  );
}
