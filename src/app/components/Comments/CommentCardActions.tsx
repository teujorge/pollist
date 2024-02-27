"use client";

import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { ThumbUpSvg } from "@/app/svgs/ThumbUpSvg";
import { CommentForm } from "./CommentForm";
import { Loader } from "../Loader";
import { PAGE_SIZE } from "@/constants";
import { CommentCard } from "./CommentCard";
import { useEffect, useState } from "react";
import { deleteComment, likeComment, unlikeComment } from "./actions";
import {
  getPaginatedComments,
  type Comment,
} from "../InfiniteComments/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CommentCardActions(comment: Comment) {
  const { user } = useUser();

  const [isReplying, setIsReplying] = useState(false);
  const [isViewingReplies, setIsViewingReplies] = useState(false);

  async function handleLike() {
    if (!user?.id) return;

    if (comment.likes.length > 0) {
      await unlikeComment({ commentId: comment.id, userId: user?.id });
    } else {
      await likeComment({ commentId: comment.id, userId: user?.id });
    }
  }

  async function handleDeleteComment() {
    if (!user?.id) return;

    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment({ commentId: comment.id });
    }
  }

  async function handleCopyThreadLink() {
    await navigator.clipboard.writeText(
      window.location.href + "?parentId=" + comment.id,
    );
    toast("Link copied to clipboard");
  }

  return (
    <>
      <div className="flex-warp flex items-center justify-between gap-4">
        <div className="flex-warp flex items-center gap-4">
          {/* reply button */}
          <button
            className="font-bold [&>span]:hovact:text-neutral-400"
            onClick={() => setIsReplying(!isReplying)}
          >
            <span className="text-neutral-500 transition-colors">Reply</span>
          </button>

          {/* like button */}
          <button
            className={`flex flex-row items-center justify-center gap-1 font-bold
              ${comment.likes.length > 0 ? "[&>span]:text-purple-500 [&>span]:hovact:text-purple-400 [&>svg]:fill-purple-500 [&>svg]:hovact:fill-purple-400" : "[&>span]:text-neutral-500 [&>span]:hovact:text-neutral-400 [&>svg]:fill-neutral-500 [&>svg]:hovact:fill-neutral-400"}
              ${user?.id ? "cursor-pointer" : "pointer-events-none cursor-not-allowed"}
            `}
            onClick={handleLike}
          >
            <ThumbUpSvg className="h-6 w-6 transition-colors" />
            <span className="transition-colors">{comment._count.likes}</span>
          </button>
        </div>

        {/* options popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full px-3 pb-2 text-lg font-bold transition-colors hovact:bg-neutral-800">
              ...
            </button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col bg-black p-4">
            {/* copy link button */}
            <button
              className="w-fit font-bold [&>span]:hovact:text-neutral-400"
              onClick={handleCopyThreadLink}
            >
              <span className="transition-colors">Copy Link</span>
            </button>

            {/* delete button */}
            {user?.id === comment.authorId && (
              <button
                className="w-fit font-bold [&>span]:hovact:text-red-500"
                onClick={handleDeleteComment}
              >
                <span className="transition-colors">Delete</span>
              </button>
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

      {comment._count.replies > 0 && (
        <button
          className="w-fit font-bold [&>span]:hovact:text-neutral-400"
          onClick={() => setIsViewingReplies(!isViewingReplies)}
        >
          <span className="text-neutral-500 transition-colors">
            View replies ({comment._count.replies})
          </span>
        </button>
      )}

      {isViewingReplies && (
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
    page: number;
    replies: Comment[];
    hasMore: boolean;
    isLoading: boolean;
  }>({
    page: 1,
    replies: [],
    hasMore: true,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchInitialComments() {
      const initialReplies = await getPaginatedComments({
        page: 1,
        pollId,
        parentId,
      });

      setData((prev) => ({
        ...prev,
        replies: initialReplies,
        hasMore: initialReplies.length === PAGE_SIZE,
        isLoading: false,
      }));
    }

    void fetchInitialComments();
  }, [pollId, parentId]);

  async function handleLoadMore() {
    if (!data.hasMore) return;
    if (data.isLoading) return;

    const newReplies = await getPaginatedComments({
      page: data.page,
      pollId,
      parentId,
    });

    setData((prev) => ({
      page: prev.page + 1,
      replies: [...prev.replies, ...newReplies],
      hasMore: newReplies.length === PAGE_SIZE,
      isLoading: false,
    }));
  }

  return (
    <div className="flex w-full flex-col gap-2 p-2 pl-4">
      {data.replies.map((reply) => (
        <CommentCard
          key={`${pollId}-${parentId}-reply-${reply.id}`}
          {...reply}
        />
      ))}

      {data.isLoading ? (
        <Loader className="mx-auto" />
      ) : data.hasMore ? (
        <button
          className="w-fit font-bold [&>span]:hovact:text-neutral-400"
          onClick={handleLoadMore}
        >
          <span className="text-neutral-500 transition-colors">load more</span>
        </button>
      ) : (
        <p className="w-full text-center text-sm text-neutral-500 underline decoration-neutral-500 underline-offset-4">
          end of reply thread
        </p>
      )}
    </div>
  );
}
