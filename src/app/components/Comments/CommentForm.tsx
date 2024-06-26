"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { createComment } from "@/app/components/Comments/actions";
import { useNewComments } from "./NewCommentsProvider";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useRef, useState } from "react";

export function CommentForm({
  pollId,
  parentId,
  atUsername,
  label,
  placeholder,
  beforeSubmit,
  afterSubmit,
}: {
  pollId: string;
  parentId: string | undefined;
  atUsername: string | undefined;
  label: string | undefined;
  placeholder: string | undefined;
  beforeSubmit?: () => void;
  afterSubmit?: () => void;
}) {
  const { user } = useUser();

  const formRef = useRef<HTMLFormElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { setNewReplies } = useNewComments();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (beforeSubmit) beforeSubmit();

    setIsLoading(true);

    const text = (
      e.currentTarget.elements.namedItem("comment") as HTMLInputElement
    )?.value;

    // Generate a temporary ID for optimistic updates
    const tempId = Date.now().toString();

    // Add the optimistic comment to the state
    setNewReplies((replies) => [
      ...replies,
      {
        id: tempId,
        pollId,
        parentId: parentId ?? null,
        text,
        at: atUsername ?? null,
        authorId: user?.id ?? "optimistic",
        sensitive: false,
        deleted: false,
        author: {
          id: user?.id ?? "optimistic",
          username: user?.username ?? "optimistic",
          imageUrl: user?.imageUrl ?? null,
          tier: "FREE",
          bio: null,
          ads: true,
          private: false,
          viewSensitive: false,
          clerkId: "optimistic",
        },
        parent: {
          authorId: "optimistic",
          author: { username: "" },
        },
        poll: {
          authorId: "optimistic",
        },
        _count: { likes: 0, replies: 0 },
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    try {
      const newComment = await createComment({
        pollId,
        parentId,
        atUsername,
        text,
      });

      // Replace the optimistic comment with the real one
      setNewReplies((replies) =>
        replies.map((reply) => (reply.id === tempId ? newComment : reply)),
      );
      formRef.current?.reset();
    } catch (e) {
      // Remove the optimistic comment
      setNewReplies((replies) =>
        replies.filter((reply) => reply.id !== tempId),
      );

      toast.error("Failed to submit comment");
    }

    setIsLoading(false);
    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = "36px";
    }

    if (afterSubmit) afterSubmit();
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
      <div className="flex w-full flex-row items-center justify-center gap-2">
        <textarea
          ref={commentTextareaRef}
          required
          disabled={isLoading}
          name="comment"
          placeholder={placeholder}
          className="h-9 max-h-[50svh] min-h-9 w-full resize-none transition-colors"
          onChange={(e) => {
            e.currentTarget.style.height = "36px";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
        />
        <div className="flex w-12 min-w-12 items-center justify-center">
          {isLoading ? (
            <Loader className="h-6 w-6 border-2" />
          ) : (
            <Button variant="outline">
              <PaperPlaneTilt />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
