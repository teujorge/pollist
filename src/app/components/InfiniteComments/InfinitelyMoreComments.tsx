"use client";

import { CommentCard } from "../Comments/CommentCard";
import { getInfiniteComments } from "./actions";
import { InfinitelyMoreItems } from "../InfiniteScroll/InfinitelyMoreItems";
import type { Comment, GetPaginatedCommentsParams } from "./actions";

export function InfinitelyMoreComments(props: {
  pollId: string;
  parentId: string | undefined;
  highlightedUserId?: string;
  initialCursor: string | undefined;
}) {
  return (
    <InfinitelyMoreItems<Comment, Omit<GetPaginatedCommentsParams, "cursor">>
      idPrefix="comment"
      query={{
        pollId: props.pollId,
        parentId: props.parentId,
        dateOrderBy: "desc",
        orderByLikes: true,
      }}
      getter={getInfiniteComments}
      initialCursor={props.initialCursor}
      ItemComponent={(comment) => <CommentCard comment={comment} />}
    />
  );
}
