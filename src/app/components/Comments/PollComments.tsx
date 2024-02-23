import { CommentForm } from "./CommentForm";
import { InfiniteComments } from "@/app/components/InfiniteComments/InfiniteComments";

export async function PollComments({ pollId }: { pollId: string }) {
  return (
    <>
      <h1 className="p-2 text-4xl">Comments</h1>
      <CommentForm
        pollId={pollId}
        parentId={undefined}
        label="New comment"
        placeholder="Write your comment here..."
      />
      <InfiniteComments pollId={pollId} parentId={undefined} />
    </>
  );
}
