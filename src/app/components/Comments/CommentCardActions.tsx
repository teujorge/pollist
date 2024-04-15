"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "../Loader";
import { PAGE_SIZE } from "@/constants";
import { NewComments } from "./NewComments";
import { CommentForm } from "./CommentForm";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { useEffect, useState } from "react";
import { getInfiniteComments } from "../InfiniteComments/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { CommentCard, useCommentCard } from "./CommentCard";
import { deleteComment, likeComment, unlikeComment } from "./actions";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Copy,
  Warning,
  DotsThree,
  CaretDown,
  ArrowFatUp,
  CaretDoubleRight,
} from "@phosphor-icons/react";
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

  useEffect(() => {
    if (isReplying) setIsViewingReplies(true);
  }, [isReplying, setIsViewingReplies]);

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
    toast.success("URL copied to clipboard");
  }

  const likeButtonComponent = (
    <Button
      size="sm"
      variant="ghost"
      className={cn(
        "gap-1 font-bold",
        comment.likes.length > 0
          ? "[&>*]:text-primary [&>*]:hovact:text-purple-400"
          : "[&>*]:text-accent-foreground [&>*]:hovact:text-foreground",
      )}
      onClick={user ? handleLike : undefined}
    >
      <ArrowFatUp className="transition-colors" />
      <span className="transition-colors">{comment._count.likes}</span>
    </Button>
  );

  const replyButtonComponent = (
    <button onClick={user ? () => setIsReplying(!isReplying) : undefined}>
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "font-bold",
        )}
      >
        Reply
      </span>
    </button>
  );

  return (
    <>
      <div className="flex-warp flex items-center justify-between gap-2">
        <div className="flex-warp flex items-center">
          <SignedIn>{likeButtonComponent}</SignedIn>
          <SignedOut>
            <SignInButton mode="modal">{likeButtonComponent}</SignInButton>
          </SignedOut>

          <SignedIn>{replyButtonComponent}</SignedIn>
          <SignedOut>
            <SignInButton mode="modal">{replyButtonComponent}</SignInButton>
          </SignedOut>
        </div>

        <Popover>
          <PopoverTrigger>
            <Button size="sm" variant="ghost">
              <DotsThree size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="py-2">
            <Button variant="popover" onClick={handleCopyThreadLink}>
              <Copy size={15} /> Copy
            </Button>

            <Button
              variant="popover"
              className="hovact:bg-yellow-500/20 hovact:text-yellow-500"
              onClick={() => toast.warning("Feature coming soon")}
            >
              <Warning size={15} />
              Report
            </Button>

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
          parentId={comment.parentId ?? comment.id}
          atUsername={comment.parentId ? comment.author.username : undefined}
          label={undefined}
          placeholder="Write your reply here..."
          beforeSubmit={() => setIsReplying(false)}
        />
      )}

      {isViewingReplies && !comment.parentId && (
        <CommentReplies pollId={comment.pollId} parentId={comment.id} />
      )}

      {!isViewingReplies && (
        <Button
          variant="ghost"
          className={cn(
            "w-fit items-center justify-center gap-1 [&>svg]:transition-transform [&>svg]:hovact:-rotate-90",
            comment.parentId && "hidden",
            comment._count.replies === 0 && "hidden",
          )}
          onClick={() => setIsViewingReplies(!isViewingReplies)}
        >
          <CaretDown size={15} /> {comment._count.replies} Replies
        </Button>
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
        dateOrderBy: "asc",
      });

      setData({
        cursor: initialReplies[initialReplies.length - 1]?.id,
        replies: initialReplies,
        hasMore: initialReplies.length === PAGE_SIZE,
        isLoading: false,
      });
    }

    void fetchInitialComments();
  }, [pollId, parentId]);

  // subsequent fetches
  async function handleLoadMore() {
    if (!data.hasMore) return;
    if (data.isLoading) return;

    setData((prev) => ({ ...prev, isLoading: true }));

    // TODO: need to handle error
    const newReplies = await getInfiniteComments({
      cursor: data.cursor,
      pollId,
      parentId,
      dateOrderBy: "asc",
    });

    setData((prev) => ({
      cursor: newReplies[newReplies.length - 1]?.id,
      replies: [...prev.replies, ...newReplies],
      hasMore: newReplies.length === PAGE_SIZE,
      isLoading: false,
    }));
  }

  return (
    <div className={"flex w-full flex-col gap-2"}>
      {data.replies.map((reply) => (
        <CommentCard
          key={`${pollId}-${parentId}-reply-${reply.id}`}
          comment={reply}
        />
      ))}
      <NewComments parentId={parentId} />

      {data.isLoading ? (
        <Loader className="ml-8 h-5 w-5 border-2" />
      ) : (
        data.hasMore && (
          <Button
            variant="ghost"
            className="w-fit items-center justify-center gap-1 [&>svg]:transition-transform [&>svg]:hovact:rotate-90"
            onClick={handleLoadMore}
          >
            <CaretDoubleRight /> Show More Replies
          </Button>
        )
      )}
    </div>
  );
}
