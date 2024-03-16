import { db } from "@/database/prisma";
import { NextResponse } from "next/server";
import type { Vote } from "@prisma/client";
import type { NextRequest } from "next/server";

// recalculating the controversy score for all polls
export async function GET(req: NextRequest) {
  console.log("CRON: Recalculating controversy scores...");

  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("CRON: Unauthorized");
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const polls = await db.poll.findMany({
    select: {
      id: true,
      title: true,
      controversial: true,
      votes: true,
    },
    where: {
      // only recalculate for polls that have been active in the last week
      updatedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
    },
  });

  let updatedPolls = 0;

  for (const poll of polls) {
    const newIsControversial = isControversial(poll.votes);

    if (poll.controversial === newIsControversial) continue;

    console.log(`CRON: Recalculating poll ${poll.id} => ${newIsControversial}`);
    await db.poll.update({
      where: { id: poll.id },
      data: {
        controversial: newIsControversial,
      },
    });
    updatedPolls++;
  }

  console.log(`CRON: Controversy scores recalculated (${updatedPolls})`);
  return NextResponse.json({
    status: 200,
    message: "Controversy scores recalculated",
  });
}

function isControversial(votes: Vote[]): boolean {
  const arbitrary = 0.5; // Adjustable controversy threshold

  // Count votes per option
  const voteCounts: Record<string, number> = {};
  for (const vote of votes) {
    if (vote.optionId in voteCounts) {
      voteCounts[vote.optionId]++;
    } else {
      voteCounts[vote.optionId] = 1;
    }
  }

  // Convert to array of counts and compute metrics
  const counts = Object.values(voteCounts);
  const meanVotes = counts.reduce((a, b) => a + b, 0) / counts.length;
  const stdDeviation = Math.sqrt(
    counts.reduce((a, b) => a + (b - meanVotes) ** 2, 0) / counts.length,
  );
  // console.log(counts, meanVotes, stdDeviation);

  // Determine if the vote distribution is controversial
  const isControversial = stdDeviation <= meanVotes * arbitrary;

  // Ensure at least two options are closely contested
  const significantCounts = counts.filter(
    (count) => count >= meanVotes * arbitrary,
  );
  const sortedSignificantCounts = significantCounts.sort((a, b) => b - a);
  const atLeastTwoOptionsClose =
    sortedSignificantCounts.length >= 2 &&
    sortedSignificantCounts[0]! - sortedSignificantCounts[1]! <=
      meanVotes * arbitrary;

  return isControversial && atLeastTwoOptionsClose;

  return isControversial;
}
