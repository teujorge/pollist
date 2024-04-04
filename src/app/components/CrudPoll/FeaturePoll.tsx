import { Loader } from "../Loader";
import { Suspense } from "react";
import { FeaturePollForm } from "./FeaturePollForm";

export function FeaturePoll({
  userId,
  pollId,
}: {
  userId: string;
  pollId: string;
}) {
  return (
    <main>
      <h1 className="text-xl font-bold">Feature A Poll</h1>
      <p className="text-sm text-accent-foreground">
        Featuring a poll on the homepage will make it more visible to other
        users!
      </p>
      <Suspense fallback={<Loader className="mx-auto mt-4" />}>
        <FeaturePollForm userId={userId} pollId={pollId} />
      </Suspense>
    </main>
  );
}
