import Link from "next/link";
import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";
import { SignInButton } from "@clerk/nextjs";
import { commentSelect } from "../InfiniteComments/commentSelect";
import { ScrollToComments } from "./ScrollToComments";
import { InfiniteComments } from "@/app/components/InfiniteComments/InfiniteComments";
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
      select: commentSelect(userId ?? undefined),
    });

    if (parentComment) {
      return (
        <NewCommentsProvider>
          <ScrollToComments />
          <div className="flex flex-row flex-wrap items-center gap-2 pb-2 pt-16">
            <h2 id="all-comments-title" className="text-2xl">
              Comment Thread
            </h2>
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
      <ScrollToComments />
      <h2 id="all-comments-title" className="pb-2 pt-16 text-2xl">
        Comments
      </h2>
      <InfiniteComments pollId={pollId} parentId={parentId} />
      <div className="sticky bottom-0 bg-gradient-to-t from-background from-80%">
        {userId ? (
          <CommentForm
            pollId={pollId}
            parentId={undefined}
            atUsername={undefined}
            label={undefined}
            placeholder="Write your comment here..."
          />
        ) : (
          <SignInButton mode="modal">
            <p className="w-full cursor-pointer p-4 text-center text-accent-foreground transition-colors hovact:text-foreground">
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

      <div className="sticky bottom-0 bg-gradient-to-t from-background from-80%">
        <form className="pointer-events-none flex w-full flex-col gap-2 p-4 opacity-50">
          <div className="flex flex-row items-end gap-2">
            <textarea
              required
              disabled
              name="comment"
              placeholder="Loading..."
              className="h-9 flex-grow"
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
