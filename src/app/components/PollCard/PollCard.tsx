import Link from "next/link";
import { ProfileImage } from "../ProfileImage";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import type { PollsDetails } from "../InfinitePolls/actions";

export type PollCardProps = {
  poll: PollsDetails[number];
  highlightedUserId?: string;
};

export function PollCard({ poll, highlightedUserId }: PollCardProps) {
  return (
    <div
      data-safe={poll.sensitive}
      className="flex w-full flex-col gap-2 rounded-lg border border-accent bg-neutral-950 p-6 shadow-md"
    >
      <Link
        href={`/users/${poll.author.username}`}
        className="flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 pl-0 transition-all [&>div>p]:hovact:text-primary [&>div>span]:hovact:text-purple-600 [&>div]:hovact:border-[#d0b3f5]"
      >
        <div className="rounded-full border-[3px] border-background transition-colors">
          <ProfileImage
            src={poll.author.imageUrl}
            username={poll.author.username}
            size={38}
          />
        </div>

        <div className="flex flex-col justify-center gap-1 border-0">
          <p className="text-neutral-200 transition-colors">
            {poll.author.username}
          </p>
          <span className="text-xs text-neutral-400 transition-colors">
            {new Date(poll.createdAt).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </Link>
      <Link href={`/polls/${poll.id}`} className="w-fit">
        <h2 className="text-2xl font-bold">{poll.title}</h2>
      </Link>

      <PollCardActions poll={poll} highlightedUserId={highlightedUserId} />
    </div>
  );
}
