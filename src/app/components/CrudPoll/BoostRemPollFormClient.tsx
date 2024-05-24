"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PollCard } from "../PollCard/PollCard";
import { unBoostPoll } from "./actions";
import type { PollsDetails } from "../InfinitePolls/actions";

export function BoostRemPollFormClient({
  userId,
  poll,
  redirectPollId,
}: {
  userId: string;
  poll: PollsDetails[number];
  redirectPollId: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleUnBoostPoll() {
    setSubmitting(true);

    try {
      await unBoostPoll(redirectPollId);
    } catch (error) {
      setSubmitting(false);
      toast.error("Failed to unboost poll");
    }
  }

  return (
    <form>
      <p className="pt-2">
        You can only boost one poll at a time. If you want to boost a different
        poll, you can unboost the current one.
      </p>

      <div className="p-2 sm:p-4">
        <PollCard userId={userId} poll={poll} />
      </div>

      <div className="flex h-9 w-full items-center justify-center">
        {submitting ? (
          <Loader className="h-5 w-5 border-2" />
        ) : (
          <Button variant="outline" onMouseDown={handleUnBoostPoll}>
            Unboost This Poll
          </Button>
        )}
      </div>
    </form>
  );
}
