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
          props.idPrefix +
          (props.authorId ?? "") +
          (props.category ?? "") +
          (props.search ?? "") +
          (props.voterId ?? "") +
          (props.highlightedUserId ?? "")
        }
        fallback={<Loader />}
      >
        <FirstAndMorePolls {...props} />
      </Suspense>
    </div>
  );
}
