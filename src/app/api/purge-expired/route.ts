import { db } from "@/database/db";
import { type NextRequest, NextResponse } from "next/server";

// purge expired polls
export async function GET(req: NextRequest) {
  console.log("CRON: Purging expired polls...");

  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("CRON: Unauthorized");
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const polls = await db.poll.findMany({
    select: { id: true },
    where: { expiresAt: { lt: new Date() } },
  });

  let purgedPolls = 0;

  for (const poll of polls) {
    console.log(`CRON: Purging poll ${poll.id}`);
    await db.poll.delete({ where: { id: poll.id } });
    purgedPolls++;
  }

  console.log(`CRON: Expired polls purged (${purgedPolls})`);
  return NextResponse.json({
    status: 200,
    message: "Expired polls purged",
  });
}
