"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ProfileImage } from "../ProfileImage";
import { CommentCardActions } from "./CommentCardActions";
import { ReplyAcknowledgmentTrigger } from "./ReplyAcknowledgmentTrigger";
import type { Comment } from "../InfiniteComments/actions";
import { useApp } from "@/app/app";

export function CommentCard(comment: Comment) {
  const { user } = useUser();
  const { notifications } = useApp();

  const unreadComment = notifications.some(
    (n) => n.type === "COMMENT_REPLY" && n.referenceId === comment.id,
  );

  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-lg border p-4
        ${user && user.id === comment.parent?.authorId && unreadComment ? "border-purple-500" : "border-neutral-800"}
      `}
    >
      <Link
        href={`/users/${comment.author.id}`}
        className="flex w-fit flex-row items-center gap-2"
      >
        {comment.author.imageUrl ? (
          <ProfileImage
            src={comment.author.imageUrl}
            alt={`${comment.author.username} profile image`}
            width={40}
            height={40}
          />
        ) : (
          <>noimg</>
        )}
        <div>
          <p className="text-sm font-bold">{comment.author.username}</p>
          <p className="text-sm font-light">
            {comment.updatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </Link>

      <p className="break-words">{comment.text}</p>

      <CommentCardActions {...comment} />

      {user?.id && user.id === comment.parent?.authorId && unreadComment && (
        <ReplyAcknowledgmentTrigger commentId={comment.id} />
      )}
    </div>
  );
}
