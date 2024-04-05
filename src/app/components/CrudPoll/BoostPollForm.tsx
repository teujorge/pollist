import { db } from "@/database/prisma";
import { pollInclude } from "../InfinitePolls/utils";
import { BoostPollFormClient } from "./BoostPollFormClient";
import { BoostRemPollFormClient } from "./BoostRemPollFormClient";

export async function BoostPollForm({
  userId,
  pollId,
}: {
  userId: string;
  pollId: string;
}) {
  const [poll, user] = await Promise.all([
    db.poll.findUnique({
      where: { id: pollId },
      include: pollInclude(userId),
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { boostedPoll: { include: pollInclude(userId) } },
    }),
  ]);

  if (!poll) return null;

  return user?.boostedPoll ? (
    <BoostRemPollFormClient
      userId={userId}
      poll={user.boostedPoll}
      redirectPollId={poll.id}
    />
  ) : (
    <BoostPollFormClient userId={userId} poll={poll} />
  );
}
