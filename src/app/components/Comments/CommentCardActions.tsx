"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { PAGE_SIZE } from "@/constants";
import { NewComments } from "./NewComments";
import { CommentForm } from "./CommentForm";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { useEffect, useState } from "react";
import { getInfiniteComments } from "../InfiniteComments/actions";
import { CommentCard, useCommentCard } from "./CommentCard";
import { DotsHorizontalIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import { deleteComment, likeComment, unlikeComment } from "./actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Comment } from "../InfiniteComments/actions";

export function CommentCardActions() {
  const { user } = useUser();

  const {
    comment,
    setComment,
    isReplying,
    setIsReplying,
    isViewingReplies,
    setIsViewingReplies,
    setIsCommentDeleted,
    isChangeProcessing,
    setIsChangeProcessing,
  } = useCommentCard();

  async function handleLike() {
    if (!user?.id) return;

    if (isChangeProcessing) {
      toast.warning("Please wait... we processing your previous request");
      return;
    }
    setIsChangeProcessing(true);

    // this comment has likes from this user
    if (comment.likes.length > 0) {
      // get the original like object
      const userLike = comment.likes.find((like) => like.authorId === user?.id);
      if (!userLike) return;

      // optimistic update
      setComment((prev) => ({
        ...prev,
        likes: prev.likes.filter((like) => like.id !== userLike.id),
        _count: {
          ...prev._count,
          likes: prev._count.likes - 1,
        },
      }));

      try {
        // db update
        await unlikeComment({
          commentId: comment.id,
          userId: user?.id,
        });
      } catch (error) {
        // put back original if the request fails
        setComment((prev) => ({
          ...prev,
          likes: [...prev.likes, userLike],
          _count: {
            ...prev._count,
            likes: prev._count.likes + 1,
          },
        }));

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to unlike comment");
        }
      }
    }

    // this comment does not have likes from this user
    else {
      // optimistic update
      setComment((prev) => ({
        ...prev,
        likes: [
          ...prev.likes,
          {
            id: "optimistic",
            authorId: user.id,
            commentId: prev.id,
            createdAt: new Date(),
          },
        ],
        _count: {
          ...prev._count,
          likes: prev._count.likes + 1,
        },
      }));

      try {
        // db update
        const newLike = await likeComment({
          commentId: comment.id,
          userId: user?.id,
        });

        // replace the optimistic like with the real one
        setComment((prev) => ({
          ...prev,
          likes: [
            ...prev.likes.filter((like) => like.id !== "optimistic"),
            newLike,
          ],
        }));
      } catch (error) {
        // remove the optimistic like if the request fails
        setComment((prev) => ({
          ...prev,
          likes: prev.likes.filter((like) => like.id !== "optimistic"),
          _count: {
            ...prev._count,
            likes: prev._count.likes - 1,
          },
        }));

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to like comment");
        }
      }
    }

    setIsChangeProcessing(false);
  }

  async function handleDeleteComment() {
    if (!user?.id) return;

    if (isChangeProcessing) {
      toast.warning("Please wait... we processing your previous request");
      return;
    }
    setIsChangeProcessing(true);

    // optimistic update
    setIsCommentDeleted(true);

    try {
      // db request
      await deleteComment({ commentId: comment.id });
    } catch (error) {
      // put back original if the request fails
      setIsCommentDeleted(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete comment, please try again");
      }
    }

    setIsChangeProcessing(false);
  }

  async function handleCopyThreadLink() {
    await navigator.clipboard.writeText(
      window.location.href + "?parentId=" + comment.id,
    );
    toast("Link copied to clipboard");
  }

  const replyButtonComponent = (
    <button
      className="font-bold [&>span]:hovact:text-neutral-400"
      onClick={user ? () => setIsReplying(!isReplying) : undefined}
    >
      <span className="text-neutral-400 transition-colors">Reply</span>
    </button>
  );

  const likeButtonComponent = (
    <button
      className={`flex flex-row items-center justify-center gap-1 font-bold
        ${comment.likes.length > 0 ? "[&>*]:text-primary [&>*]:hovact:text-purple-400" : "[&>*]:text-neutral-400 [&>*]:hovact:text-neutral-300"}
      `}
      onClick={user ? handleLike : undefined}
    >
      <ThickArrowUpIcon className="transition-colors" />
      <span className="transition-colors">{comment._count.likes}</span>
    </button>
  );

  return (
    <>
      <div className="flex-warp flex items-center justify-between gap-4">
        <div className="flex-warp flex items-center gap-4">
          <SignedIn>{replyButtonComponent}</SignedIn>
          <SignedOut>
            <SignInButton mode="modal">{replyButtonComponent}</SignInButton>
          </SignedOut>

          <SignedIn>{likeButtonComponent}</SignedIn>
          <SignedOut>
            <SignInButton mode="modal">{likeButtonComponent}</SignInButton>
          </SignedOut>
        </div>

        {/* options popover */}
        <Popover>
          <PopoverTrigger>
            <Button
              variant="ghost"
              className="flex h-7 w-7 items-center justify-center rounded-full p-1.5"
            >
              <DotsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex flex-col bg-background p-4"
          >
            {/* copy link button */}
            <button
              className="w-fit font-bold [&>span]:hovact:text-neutral-400"
              onClick={handleCopyThreadLink}
            >
              <span className="transition-colors">Copy Link</span>
            </button>

            {/* delete button */}
            {user?.id === comment.authorId && (
              <DeleteAlertDialog
                awaitType="promise"
                onDelete={handleDeleteComment}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>

      {isReplying && (
        <CommentForm
          pollId={comment.pollId}
          parentId={comment.id}
          label={undefined}
          placeholder="Write your reply here..."
        />
      )}

      <button
        className="w-fit font-bold [&>span]:hovact:text-neutral-400"
        onClick={() => setIsViewingReplies(!isViewingReplies)}
      >
        <span className="text-neutral-400 transition-colors">
          View replies ({comment._count.replies})
        </span>
      </button>

      {(isReplying || isViewingReplies) && (
        <CommentReplies pollId={comment.pollId} parentId={comment.id} />
      )}
    </>
  );
}

function CommentReplies({
  pollId,
  parentId,
}: {
  pollId: string;
  parentId: string;
}) {
  const [data, setData] = useState<{
    cursor: string | undefined;
    replies: Comment[];
    hasMore: boolean;
    isLoading: boolean;
  }>({
    cursor: undefined,
    replies: [],
    hasMore: true,
    isLoading: true,
  });

  // initial fetch
  useEffect(() => {
    async function fetchInitialComments() {
      // TODO: need to handle error
      const initialReplies = await getInfiniteComments({
        cursor: undefined,
        pollId,
        parentId,
      });

      setData((prev) => ({
        ...prev,
        page: 2,
        replies: initialReplies,
        hasMore: initialReplies.length === PAGE_SIZE,
        isLoading: false,
      }));
    }

    void fetchInitialComments();
  }, [pollId, parentId]);

  // subsequent fetches
  async function handleLoadMore() {
    if (!data.hasMore) return;
    if (data.isLoading) return;

    // TODO: need to handle error
    const newReplies = await getInfiniteComments({
      cursor: data.cursor,
      pollId,
      parentId,
    });

    setData((prev) => ({
      cursor: newReplies[newReplies.length - 1]?.id,
      replies: [...prev.replies, ...newReplies],
      hasMore: newReplies.length === PAGE_SIZE,
      isLoading: false,
    }));
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 pl-4">
      <NewComments parentId={parentId} />
      {data.replies.map((reply) => (
        <CommentCard
          key={`${pollId}-${parentId}-reply-${reply.id}`}
          comment={reply}
        />
      ))}

      {data.isLoading ? (
        <Loader className="mx-auto" />
      ) : data.hasMore ? (
        <button
          className="w-fit font-bold [&>span]:hovact:text-neutral-400"
          onClick={handleLoadMore}
        >
          <span className="text-neutral-400 transition-colors">load more</span>
        </button>
      ) : (
        <p className="w-full text-center text-sm text-neutral-400 underline decoration-neutral-500 underline-offset-4">
          end of reply thread
        </p>
      )}
    </div>
  );
}
