import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";

export async function UserVoteCount() {
  const { userId } = auth();

  if (!userId) return null;

  const voteCount = db.vote.count({
    where: {
      voterId: userId,
    },
  });

  return (
    <p className="flex flex-col items-center ">
      <span className="font-semibold">Votes </span>
      <span className="text-neutral-300">{voteCount}</span>
    </p>
  );
}
