import Link from "next/link";
import { cn } from "@/lib/utils";
import { db } from "@/database/prisma";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";

export function CTA() {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "shimmer",
            buttonVariants({ variant: "secondary", size: "lg" }),
            "pointer-events-none text-background/50",
          )}
        >
          Participate in a Poll
        </div>
      }
    >
      <_CTA />
    </Suspense>
  );
}

async function _CTA() {
  const randomPopularPoll = await db.poll.findFirst({
    orderBy: {
      votes: { _count: "desc" },
    },
  });

  if (!randomPopularPoll) {
    throw new Error("Error fetching a popular poll...");
  }

  if (randomPopularPoll.anonymous) {
    randomPopularPoll.authorId = "Anon";
  }

  return (
    <Link
      href={`/polls/${randomPopularPoll.id}`}
      className={cn(
        buttonVariants({ variant: "secondary", size: "lg" }),
        "hovact:text-background",
      )}
    >
      Participate in a Poll
    </Link>
  );
}
