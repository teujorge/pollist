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

  return <p>Creations: {createCount}</p>;
}
