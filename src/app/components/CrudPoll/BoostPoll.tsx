import { Loader } from "../Loader";
import { Suspense } from "react";
import { BoostPollForm } from "./BoostPollForm";

export function BoostPoll({
  userId,
  pollId,
}: {
  userId: string;
  pollId: string;
}) {
  return (
    <main>
      <h1 className="text-xl font-bold">Boost A Poll</h1>
      <p className="text-sm text-accent-foreground">
        Boosting a poll on the homepage will make it more visible to other
        users!
      </p>
      <Suspense fallback={<Loader className="mx-auto mt-4" />}>
        <BoostPollForm userId={userId} pollId={pollId} />
      </Suspense>
    </main>
  );
}
