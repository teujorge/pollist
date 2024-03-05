"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { useUser } from "@clerk/nextjs";
import { createComment } from "@/app/components/Comments/actions";
import { useNewComments } from "./NewCommentsProvider";
import { useRef, useState } from "react";

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
  const { user } = useUser();

  const formRef = useRef<HTMLFormElement>(null);

  const { setNewReplies } = useNewComments();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    const text = (
      e.currentTarget.elements.namedItem("comment") as HTMLInputElement
    )?.value;

    // Generate a temporary ID for optimistic updates
    const tempId = Date.now().toString();

    // Add the optimistic comment to the state
    setNewReplies((replies) => [
      {
        id: tempId,
        pollId,
        parentId: parentId ?? null,
        text,
        authorId: user?.id ?? "optimistic",
        author: {
          id: user?.id ?? "optimistic",
          username: user?.username ?? "optimistic",
          imageUrl: user?.imageUrl ?? null,
          bio: null,
        },
        parent: {
          authorId: "optimistic",
        },
        poll: {
          authorId: "optimistic",
        },
        _count: { likes: 0, replies: 0 },
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...replies,
    ]);

    try {
      const newComment = await createComment({ pollId, parentId, text });

      // Replace the optimistic comment with the real one
      setNewReplies((replies) =>
        replies.map((reply) => (reply.id === tempId ? newComment : reply)),
      );
      formRef.current?.reset();
    } catch (e) {
      console.error(e);

      // Remove the optimistic comment
      setNewReplies((replies) =>
        replies.filter((reply) => reply.id !== tempId),
      );

      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error(
          "An error occurred while submitting your comment, please try again",
        );
      }
    }

    setIsLoading(false);
  }

  return (
    <form
      ref={formRef}
      className={`flex w-full flex-col gap-2 p-4 transition-opacity
        ${isLoading ? "opacity-50" : "opacity-100"}
      `}
      onSubmit={handleSubmit}
    >
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
