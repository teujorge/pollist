import { CommentCard } from "../Comments/CommentCard";
import { NewComments } from "../Comments/NewComments";
import { getInfiniteComments } from "./actions";
import { InfinitelyMoreComments } from "./InfinitelyMoreComments";

export async function InfiniteComments(props: {
  pollId: string;
  parentId: string | undefined;
}) {
  const firstComments = await getInfiniteComments({
    cursor: undefined,
    pollId: props.pollId,
    parentId: props.parentId,
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <NewComments parentId={undefined} />
      {firstComments.map((comment) => (
        <CommentCard
          key={`${props.pollId}-comment-${comment.id}`}
          comment={comment}
        />
      ))}
      <InfinitelyMoreComments
        pollId={props.pollId}
        parentId={props.parentId}
        initialCursor={firstComments[firstComments.length - 1]!.id}
      />
    </div>
  );
}
