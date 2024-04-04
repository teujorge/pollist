"use client";

import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PollCard } from "../PollCard/PollCard";
import { featurePoll } from "./actions";
import type { PollsDetails } from "../InfinitePolls/actions";

export function FeaturePollFormClient({
  userId,
  poll,
}: {
  userId: string;
  poll: PollsDetails[number];
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleFeaturePoll() {
    setSubmitting(true);
    await featurePoll(poll.id);
  }

  return (
    <form>
      <div className="p-2 sm:p-4">
        <PollCard userId={userId} poll={poll} />
      </div>

      <div className="flex h-9 w-full items-center justify-center">
        {submitting ? (
          <Loader className="h-5 w-5 border-2" />
        ) : (
          <Button variant="secondary" onClick={handleFeaturePoll}>
            Feature This Poll
          </Button>
        )}
      </div>
    </form>
  );
}
