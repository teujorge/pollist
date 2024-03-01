"use client";

import { CommentCard } from "../Comments/CommentCard";
import { InfinitelyMoreItems } from "../InfiniteScroll/InfinitelyMoreItems";
import { type Comment, getPaginatedComments } from "./actions";

export function InfinitelyMoreComments(props: {
  pollId: string;
  parentId: string | undefined;
  highlightedUserId?: string;
}) {
  return (
    <InfinitelyMoreItems<
      Comment,
      { pollId: string; parentId: string | undefined }
    >
      idPrefix="comment"
      query={{ pollId: props.pollId, parentId: props.parentId }}
      getter={getPaginatedComments}
      ItemComponent={(comment) => <CommentCard comment={comment} />}
    />
  );
}
