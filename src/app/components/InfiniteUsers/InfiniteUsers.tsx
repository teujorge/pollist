import { auth } from "@clerk/nextjs/server";
import { UserCard } from "./UserCard";
import { getInfiniteUsers } from "./actions";
import { InfinitelyMoreUsers } from "./InfinitelyMoreUsers";

export const dynamic = "force-dynamic";

export async function InfiniteUsers(props: {
  idPrefix: string;
  username: string;
}) {
  const { userId } = auth();

  const firstUsers = await getInfiniteUsers({
    cursor: undefined,
    username: props.username,
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {firstUsers.map((user) => (
        <UserCard
          key={`${props.idPrefix}-user-card-${user.id}`}
          user={user}
          userId={userId}
        />
      ))}
      <InfinitelyMoreUsers
        userId={userId}
        idPrefix={props.idPrefix}
        username={props.username}
        initialCursor={firstUsers[firstUsers.length - 1]?.id}
      />
    </div>
  );
}
