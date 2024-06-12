"use client";

import { UserCard } from "./UserCard";
import { getInfiniteUsers } from "./actions";
import { InfinitelyMoreItems } from "../InfiniteScroll/InfinitelyMoreItems";
import type { UsersDetails } from "./actions";

export function InfinitelyMoreUsers(props: {
  userId: string | null;
  username: string;
  idPrefix: string;
  initialCursor: string | undefined;
}) {
  return (
    <InfinitelyMoreItems<UsersDetails[number], { username: string }>
      idPrefix={props.idPrefix}
      query={{ username: props.username }}
      getter={getInfiniteUsers}
      initialCursor={props.initialCursor}
      ItemComponent={(user) => <UserCard userId={props.userId} user={user} />}
    />
  );
}
