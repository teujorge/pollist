"use client";

import Link from "next/link";
import { cn, timeElapsed } from "@/lib/utils";
import { useApp } from "@/app/(with-auth)/app";
import { useUser } from "@clerk/nextjs";
import { ProfileImage } from "../ProfileImage";
import { CommentCardActions } from "./CommentCardActions";
import { TriggerNotificationSeen } from "../TriggerNotificationSeen";
import { createContext, useContext, useState } from "react";
import { acknowledgeCommentLike, acknowledgeCommentReply } from "./actions";
import type { Comment } from "../InfiniteComments/actions";

export function CommentCard({
  comment: _comment,
  isViewingReplies: _isViewingReplies = false,
}: {
  comment: Comment;
  isViewingReplies?: boolean;
}) {
  const { user } = useUser();
  const { notifications, isUserBlocked } = useApp();

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
    (n) => n.commentLike.comment.id === comment.id,
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
          className={cn(
            "flex w-full flex-row items-start justify-start gap-2 rounded-lg border border-transparent p-2",
            showPurpleForUnreadComment ||
              (showPurpleForUnreadLike && "border-primary"),
          )}
        >
          <Link href={`/users/${comment.author.username}`}>
            <ProfileImage
              src={comment.author.imageUrl}
              username={comment.author.username}
              size={36}
            />
          </Link>

          <div className="flex w-full flex-col gap-1">
            <div className="flex w-fit flex-row items-center justify-center gap-1">
              <Link
                href={`/users/${comment.author.username}`}
                className="text-sm font-bold"
              >
                {comment.author.username}
              </Link>
              <p className="text-xs text-accent-foreground">
                {timeElapsed(comment.updatedAt)} ago
              </p>
            </div>

            <p className="break-words break-all">
              {comment.at && (
                <Link className="text-primary/85" href={`/users/${comment.at}`}>
                  @{comment.at}{" "}
                </Link>
              )}
              <span
                className={cn(
                  isUserBlocked(comment.authorId) &&
                    "line-through decoration-accent-foreground decoration-8",
                )}
              >
                {comment.text}
              </span>
            </p>

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
