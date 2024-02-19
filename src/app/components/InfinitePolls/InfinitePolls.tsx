import { Suspense } from "react";
import { Loader } from "../Loader";
import { FirstAndMorePolls } from "./FirstAndMorePolls";
import type { PollQuery } from "@/constants";

export function InfinitePolls(
  props: PollQuery & { highlightedUserId?: string; idPrefix: string },
) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Suspense
        key={
          (props.authorId ?? "") +
          (props.category ?? "") +
          (props.search ?? "") +
          (props.voterId ?? "")
        }
        fallback={<Loader />}
      >
        <FirstAndMorePolls {...props} />
      </Suspense>
    </div>
  );
}
