"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { useState } from "react";
import { createComment } from "@/app/components/Comments/actions";

export function CommentForm({
  pollId,
  parentId,
  label,
  placeholder,
}: {
  pollId: string;
  parentId: string | undefined;
  label: string | undefined;
  placeholder: string | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const text = (
        e.currentTarget.elements.namedItem("comment") as HTMLInputElement
      )?.value;

      const newComment = await createComment({ pollId, parentId, text });
      console.log(newComment);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        toast(e.message);
      } else {
        toast(
          "An error occurred while submitting your comment, please try again",
        );
      }
    }

    setIsLoading(false);
  }

  return (
    <form className="flex w-full flex-col gap-2 p-4" onSubmit={handleSubmit}>
      {label && <label>{label}</label>}
      <div className="flex flex-row items-end gap-2">
        <textarea
          required
          disabled={isLoading}
          name="comment"
          placeholder={placeholder}
          className="flex-grow"
        />
        <div className="flex w-20 items-center justify-center">
          {isLoading ? (
            <Loader />
          ) : (
            <button className="ml-auto rounded-full px-3 py-1 text-green-500 hovact:bg-green-950">
              Submit
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
