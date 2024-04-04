import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { Suspense } from "react";
import { PollCard } from "@/app/components/PollCard/PollCard";
import { pollInclude } from "@/app/components/InfinitePolls/utils";
import { FeaturedPollIdHandler } from "./FeaturedPollIdHandler";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

async function _FeaturedPoll() {
  const { userId } = auth();

  const featuredPollsCount = await db.poll.count({
    where: { featuredById: { not: null } },
  });

  const randomOffset = Math.floor(Math.random() * featuredPollsCount);

  const randomFeaturedPolls: PollsDetails = await db.poll.findMany({
    where: { featuredById: { not: null } },
    skip: randomOffset,
    take: 1,
    include: pollInclude(userId),
  });

  const randomFeaturedPoll = randomFeaturedPolls[0];

  if (!randomFeaturedPoll) return null;

  return (
    <>
      <div className="relative w-full">
        <PollCard poll={randomFeaturedPoll} userId={userId} />
        <FeaturedPollIdHandler featuredPollId={randomFeaturedPoll.id} />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Featured
        </span>
      </div>
      <div className="h-1" />
    </>
  );
}

export function FeaturedPoll() {
  return (
    <Suspense>
      <_FeaturedPoll />
    </Suspense>
  );
}
