import Link from "next/link";
import { ProfileImage } from "../ProfileImage";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import type { PollsDetails } from "../InfinitePolls/actions";

export type PollCardProps = {
  poll: PollsDetails[number];
  highlightedUserId?: string;
};

export function PollCard({ poll, highlightedUserId }: PollCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
      <Link
        href={`/users/${poll.authorId}`}
        // rel="noopener noreferrer"
        // target="_blank"
        className="flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 pl-0 transition-all [&>div>p]:hovact:text-purple-500 [&>div>span]:hovact:text-purple-600 [&>img]:hovact:border-purple-500"
      >
        {poll.author.imageUrl && (
          <ProfileImage
            src={poll.author.imageUrl}
            alt={poll.author.username ?? "author's avatar"}
            width={38}
            height={38}
            className="rounded-full border-2 border-neutral-600 transition-colors"
          />
        )}

        <div className="flex flex-col justify-center gap-1">
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
      <Link
        href={`/polls/${poll.id}`}
        // rel="noopener noreferrer"
        // target="_blank"
        className="w-fit"
      >
        <h2 className="text-2xl font-bold">{poll.title}</h2>
      </Link>

      <PollCardVoting poll={poll} highlightedUserId={highlightedUserId} />
    </div>
  );
}
