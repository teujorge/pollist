"use client";

import { CommentCard } from "../Comments/CommentCard";
import { InfinitelyMoreItems } from "../InfiniteScroll/InfinitelyMoreItems";
import { type Comment, getInfiniteComments } from "./actions";

export function InfinitelyMoreComments(props: {
  pollId: string;
  parentId: string | undefined;
  highlightedUserId?: string;
  initialCursor: string | undefined;
}) {
  return (
    <InfinitelyMoreItems<
      Comment,
      { pollId: string; parentId: string | undefined }
    >
      idPrefix="comment"
      query={{ pollId: props.pollId, parentId: props.parentId }}
      getter={getInfiniteComments}
      initialCursor={props.initialCursor}
      ItemComponent={(comment) => <CommentCard comment={comment} />}
    />
  );
}
