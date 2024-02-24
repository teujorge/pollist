import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";
import { InfiniteComments } from "@/app/components/InfiniteComments/InfiniteComments";

export async function AllComments({
  pollId,
  parentId,
}: {
  pollId: string;
  parentId: string | undefined;
}) {
  const { userId } = auth();

  if (parentId) {
    const parentComment = await db.comment.findUnique({
      where: { id: parentId },
      include: {
        author: true,
        likes: {
          where: {
            authorId: userId ?? undefined,
          },
        },
        parent: {
          select: {
            authorId: true,
          },
        },
        _count: {
          select: { likes: true, replies: true },
        },
      },
    });

    if (parentComment) {
      return (
        <>
          <h1 className="p-2 text-4xl">Comment Thread</h1>
          <CommentCard {...parentComment} />
        </>
      );
    } else {
      return notFound();
    }
  }

  return (
    <>
      <h1 className="p-2 text-4xl">Comments</h1>
      <CommentForm
        pollId={pollId}
        parentId={parentId}
        label="New comment"
        placeholder="Write your comment here..."
      />
      <InfiniteComments pollId={pollId} parentId={parentId} />
    </>
  );
}
