import { Suspense } from "react";
import { PollCardContent } from "./PollCardContent";
import { PollCardFallback } from "./PollCardFallback";

export function PollCard({ pollId }: { pollId: string }) {
  console.log("SHOULD POL CARD WITH SUSPENSE");

  return (
    <Suspense fallback={<PollCardFallback />}>
      <PollCardContent pollId={pollId} />
    </Suspense>
  );
}
