import Link from "next/link";
import { db } from "@/database/prisma";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";
import { InfiniteComments } from "@/app/components/InfiniteComments/InfiniteComments";
import { SignInButton, auth } from "@clerk/nextjs";
import { NewCommentsProvider } from "./NewCommentsProvider";

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
        <NewCommentsProvider>
          <div className="flex flex-row flex-wrap items-center gap-2 pb-2 pt-16">
            <h2 className="text-2xl">Comment Thread</h2>
            <Link href={`/polls/${pollId}`}>Back to Main Poll Discussion</Link>
          </div>
          <CommentCard comment={parentComment} isViewingReplies={true} />
        </NewCommentsProvider>
      );
    } else {
      return notFound();
    }
  }

  return (
    <NewCommentsProvider>
      <h2 className="pb-2 pt-16 text-2xl">Comments</h2>
      <InfiniteComments pollId={pollId} parentId={parentId} />
      <div className="sticky bottom-0 bg-gradient-to-t from-black from-80%">
        {userId ? (
          <CommentForm
            pollId={pollId}
            parentId={parentId}
            label={undefined}
            placeholder="Write your comment here..."
          />
        ) : (
          <SignInButton mode="modal">
            <p className="w-full cursor-pointer p-4 text-center text-neutral-400 hovact:text-white">
              Sign in to share your thoughts
            </p>
          </SignInButton>
        )}
      </div>
    </NewCommentsProvider>
  );
}

export function AllCommentsFallback() {
  return (
    <>
      <p className="py-4 pt-16 text-2xl">Comments</p>

      <div className="flex w-full items-center justify-center">
        <Loader />
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-black from-80%">
        <form className="pointer-events-none flex w-full flex-col gap-2 p-4 opacity-50">
          <div className="flex flex-row items-end gap-2">
            <textarea
              required
              disabled
              name="comment"
              placeholder="Loading..."
              className="h-20 flex-grow"
            />
            <div className="flex w-20 items-center justify-center">
              <Button variant="outline" className="ml-auto">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
