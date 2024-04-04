import { db } from "@/database/prisma";
import { pollInclude } from "../InfinitePolls/utils";
import { FeaturePollFormClient } from "./FeaturePollFormClient";
import { UnfeaturePollFormClient } from "./UnfeaturePollFormClient";

export async function FeaturePollForm({
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
      select: { feature: { include: pollInclude(userId) } },
    }),
  ]);

  if (!poll) return null;

  return user?.feature ? (
    <UnfeaturePollFormClient
      userId={userId}
      poll={user.feature}
      redirectPollId={poll.id}
    />
  ) : (
    <FeaturePollFormClient userId={userId} poll={poll} />
  );
}
