"use client";

import Link from "next/link";
import { useApp } from "@/app/(with-auth)/app";
import { useUser } from "@clerk/nextjs";
import { ProfileImage } from "../ProfileImage";
import { CommentCardActions } from "./CommentCardActions";
import { createContext, useContext, useState } from "react";
import type { Comment } from "../InfiniteComments/actions";
import { TriggerNotificationSeen } from "../TriggerNotificationSeen";
import { acknowledgeCommentLike, acknowledgeCommentReply } from "./actions";

export function CommentCard({
  comment: _comment,
  isViewingReplies: _isViewingReplies = false,
}: {
  comment: Comment;
  isViewingReplies?: boolean;
}) {
  const { user } = useUser();
  const { notifications } = useApp();

  const [comment, setComment] = useState(_comment);
  const [isReplying, setIsReplying] = useState(_isViewingReplies);
  const [isViewingReplies, setIsViewingReplies] = useState(_isViewingReplies);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [isChangeProcessing, setIsChangeProcessing] = useState(false);

  const isReplyUnread = notifications.comments.some(
    (n) => n.commentId === comment.id,
  );
  const showPurpleForUnreadComment =
    (user && user.id === comment.parent?.authorId && isReplyUnread) ?? false;

  const isLikeUnread = notifications.commentLikes.some(
    (n) => n.commentLike.commentId === comment.id,
  );
  const showPurpleForUnreadLike =
    (user && user.id === comment.authorId && isLikeUnread) ?? false;

  return (
    <CommentCardContextProvider
      value={{
        comment,
        setComment,
        isReplying,
        setIsReplying,
        isViewingReplies,
        setIsViewingReplies,
        isCommentDeleted,
        setIsCommentDeleted,
        isChangeProcessing,
        setIsChangeProcessing,
      }}
    >
      {isCommentDeleted ? null : (
        <div
          className={`flex w-full flex-col gap-2 rounded-lg border bg-neutral-950 p-4
        ${showPurpleForUnreadComment || showPurpleForUnreadLike ? "border-primary" : "border-accent"}
        `}
        >
          <Link
            href={`/users/${comment.author.id}`}
            className="flex w-fit flex-row items-center gap-2"
          >
            <ProfileImage
              src={comment.author.imageUrl}
              username={comment.author.username}
              size={40}
            />

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

          <CommentCardActions />

          {showPurpleForUnreadComment && (
            <TriggerNotificationSeen
              acknowledgeFunction={async () => {
                await acknowledgeCommentReply({ commentId: comment.id });
              }}
            />
          )}
          {showPurpleForUnreadLike && (
            <TriggerNotificationSeen
              acknowledgeFunction={async () => {
                await acknowledgeCommentLike({ commentId: comment.id });
              }}
            />
          )}
        </div>
      )}
    </CommentCardContextProvider>
  );
}

type CommentCardContextValue = {
  comment: Comment;
  setComment: React.Dispatch<React.SetStateAction<Comment>>;

  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;

  isViewingReplies: boolean;
  setIsViewingReplies: React.Dispatch<React.SetStateAction<boolean>>;

  isCommentDeleted: boolean;
  setIsCommentDeleted: React.Dispatch<React.SetStateAction<boolean>>;

  isChangeProcessing: boolean;
  setIsChangeProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentCardContext = createContext<CommentCardContextValue | undefined>(
  undefined,
);

function CommentCardContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: CommentCardContextValue;
}) {
  return (
    <CommentCardContext.Provider value={value}>
      {children}
    </CommentCardContext.Provider>
  );
}

export function useCommentCard() {
  const context = useContext(CommentCardContext);

  if (!context) {
    throw new Error(
      "useCommentCard must be used within a CommentCardContextProvider",
    );
  }

  return context;
}
