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
    <p className="flex flex-row items-center ">
      <span className="font-bold">{voteCount} </span>
      <span>Votes</span>
    </p>
  );
}
