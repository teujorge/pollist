import { Suspense } from "react";
import { UserCreateCount } from "./UserCreateCount";
import { UserVoteCount } from "./UserVoteCount";

export function UserStatistics() {
  return (
    <>
      <Suspense fallback={"create count..."}>
        <UserCreateCount />
      </Suspense>
      <Suspense fallback={"vote count..."}>
        <UserVoteCount />
      </Suspense>
    </>
  );
}
