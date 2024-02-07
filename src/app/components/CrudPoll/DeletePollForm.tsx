"use client";

import { toast } from "sonner";
import { deletePoll } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "../Loader";

export function DeletePollForm({ pollId }: { pollId: string }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsLoading(true);
      await deletePoll(formData);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "An unknown error occurred while deleting the poll. Please try again.",
        );
      }

      console.error("Error:", error);
    }
  }

  return (
    <form className="flex max-w-full flex-col" onSubmit={onSubmit}>
      <input type="hidden" name="pollId" value={pollId} />

      <p className="p-2 text-lg">Are you sure you want to delete this Poll?</p>

      <div className="flex h-10 w-full flex-row items-end justify-end">
        {isLoading ? (
          <Loader className="h-8 w-8" />
        ) : (
          <>
            <button
              className="rounded-lg px-4 py-2"
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </button>

            <button className="rounded-lg bg-red-500 px-4 py-2" type="submit">
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  );
}
