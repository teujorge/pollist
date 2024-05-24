"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PollCard } from "../PollCard/PollCard";
import { boostPoll } from "./actions";
import type { PollsDetails } from "../InfinitePolls/actions";

export function BoostPollFormClient({
  userId,
  poll,
}: {
  userId: string;
  poll: PollsDetails[number];
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleBoostPoll() {
    setSubmitting(true);

    try {
      await boostPoll(poll.id);
    } catch (error) {
      setSubmitting(false);
      toast.error("Failed to boost poll");
    }
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
          <Button variant="secondary" onMouseDown={handleBoostPoll}>
            Boost This Poll
          </Button>
        )}
      </div>
    </form>
  );
}
