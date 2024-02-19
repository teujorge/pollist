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
    <p className="flex flex-row items-center ">
      <span className="font-bold">{createCount}</span>
      <span>Creations</span>
    </p>
  );
}
