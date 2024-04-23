import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs";
import { Suspense } from "react";
import { PollCard } from "@/app/components/PollCard/PollCard";
import { BoostedPollIdHandler } from "./BoostedPollIdHandler";
import {
  pollInclude,
  censorPollAuthor,
} from "@/app/components/InfinitePolls/utils";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

async function _BoostedPoll() {
  const { userId } = auth();

  const boostedPollsCount = await db.poll.count({
    where: { boostedById: { not: null } },
  });

  const randomOffset = Math.floor(Math.random() * boostedPollsCount);

  const randomBoostedPolls: PollsDetails = await db.poll.findMany({
    where: { boostedById: { not: null } },
    skip: randomOffset,
    take: 1,
    include: pollInclude(userId),
  });

  const randomBoostedPoll = randomBoostedPolls[0];

  if (!randomBoostedPoll) return null;

  if (randomBoostedPoll.anonymous) {
    censorPollAuthor(randomBoostedPoll, userId);
  }

  return (
    <>
      <div className="relative w-full">
        <PollCard poll={randomBoostedPoll} userId={userId} />
        <BoostedPollIdHandler boostedPollId={randomBoostedPoll.id} />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Boosted
        </span>
      </div>
      <div className="h-1" />
    </>
  );
}

export function BoostedPoll() {
  return (
    <Suspense>
      <_BoostedPoll />
    </Suspense>
  );
}
