import { Suspense } from "react";
import { UserCreateCount } from "./UserCreateCount";
import { UserVoteCount } from "./UserVoteCount";

export function UserStatistics() {
  return (
    <div className="flex flex-row gap-4">
      <Suspense
        fallback={
          <p className="shimmer text-transparent">
            <span>Creations </span>
            <span>100</span>
          </p>
        }
      >
        <UserCreateCount />
      </Suspense>
      <Suspense
        fallback={
          <p className="shimmer text-transparent">
            <span>Votes </span>
            <span>100</span>
          </p>
        }
      >
        <UserVoteCount />
      </Suspense>
    </div>
  );
}
