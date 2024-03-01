"use client";

import { CommentCard } from "./CommentCard";
import { useNewComments } from "./NewCommentsProvider";

export function NewComments({ parentId }: { parentId: string | undefined }) {
  const { newReplies } = useNewComments();

  return (
    <div className="flex w-full flex-col gap-2">
      {newReplies
        .filter((reply) => reply.parentId === (parentId ?? null))
        .map((reply) => (
          <CommentCard key={reply.id} comment={reply} />
        ))}
    </div>
  );
}
