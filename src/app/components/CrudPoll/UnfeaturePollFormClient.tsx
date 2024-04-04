"use client";

import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PollCard } from "../PollCard/PollCard";
import { unfeaturePoll } from "./actions";
import type { PollsDetails } from "../InfinitePolls/actions";

export function UnfeaturePollFormClient({
  userId,
  poll,
  redirectPollId,
}: {
  userId: string;
  poll: PollsDetails[number];
  redirectPollId: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleUnfeaturePoll() {
    setSubmitting(true);
    await unfeaturePoll(redirectPollId);
  }

  return (
    <form>
      <p className="pt-2">
        You can only feature one poll at a time. If you want to feature a
        different poll, you can unfeature the current one.
      </p>

      <div className="p-2 sm:p-4">
        <PollCard userId={userId} poll={poll} />
      </div>

      <div className="flex h-9 w-full items-center justify-center">
        {submitting ? (
          <Loader className="h-5 w-5 border-2" />
        ) : (
          <Button variant="outline" onClick={handleUnfeaturePoll}>
            Unfeature This Poll
          </Button>
        )}
      </div>
    </form>
  );
}
