"use client";

import { toast } from "sonner";
import { deletePoll } from "./actions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
        toast.error("An unknown error occurred while deleting the poll");
      }

      console.error("Error:", error);
    }
  }

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [isLoading]);

  return (
    <form
      className="flex w-96 flex-col overflow-auto rounded-xl border border-neutral-800 bg-black p-4 shadow-md"
      onSubmit={onSubmit}
    >
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