import { CommentCard } from "../Comments/CommentCard";
import { getPaginatedComments } from "./actions";
import { InfinitelyMoreComments } from "./InfinitelyMoreComments";

export async function InfiniteComments(props: {
  pollId: string;
  parentId: string | undefined;
}) {
  const firstComments = await getPaginatedComments({
    page: 1,
    pollId: props.pollId,
    parentId: props.parentId,
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {firstComments.map((comment) => (
        <CommentCard
          key={`${props.pollId}-comment-${comment.id}`}
          {...comment}
        />
      ))}
      <InfinitelyMoreComments pollId={props.pollId} parentId={props.parentId} />
    </div>
  );
}
