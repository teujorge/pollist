"use client";

import Link from "next/link";
import { useApp } from "@/app/app";
import { useUser } from "@clerk/nextjs";
import { ProfileImage } from "../ProfileImage";
import { CommentCardActions } from "./CommentCardActions";
import { ReplyAcknowledgmentTrigger } from "./ReplyAcknowledgmentTrigger";
import { createContext, useContext, useState } from "react";
import type { Comment } from "../InfiniteComments/actions";

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

  const unreadComment = notifications.comments.some(
    (n) => n.commentId === comment.id,
  );

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
        ${user && user.id === comment.parent?.authorId && unreadComment ? "border-purple-500" : "border-neutral-700"}
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

          {user?.id &&
            user.id === comment.parent?.authorId &&
            unreadComment && (
              <ReplyAcknowledgmentTrigger commentId={comment.id} />
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
