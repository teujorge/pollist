"use client";

import { toast } from "sonner";
import { deletePoll } from "@/app/components/CrudPoll/actions";
import { DeleteAlertDialog } from "@/app/components/DeleteAlertDialog";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

export function DeletePollForm({ poll }: { poll: PollsDetails[number] }) {
  async function handleDelete() {
    try {
      await deletePoll(poll);
      return true;
    } catch (error) {
      toast.error("Failed to delete poll");
    }

    return false;
  }

  return <DeleteAlertDialog awaitType="forever" onDelete={handleDelete} />;
}
