import Link from "next/link";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import Image from "next/image";
import type { PollsDetails } from "../InfinitePolls/actions";

export type PollCardProps = {
  poll: PollsDetails[number];
  highlightOptionId?: string;
};

export function PollCard({ poll, highlightOptionId }: PollCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
      <Link
        href={`/users/${poll.authorId}`}
        rel="noopener noreferrer"
        target="_blank"
        className="flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 pl-0 transition-all hovact:bg-purple-500 hovact:pl-2"
      >
        {poll.author.imageUrl && (
          <Image
            src={poll.author.imageUrl}
            alt={poll.author.username ?? "author's avatar"}
            width={38}
            height={38}
            className="rounded-full"
          />
        )}

        <div className="flex flex-col justify-center gap-1 [&>desc]:text-sm">
          <p className="text-neutral-200">{poll.author.username}</p>
          <p className="text-neutral-400">
            {new Date(poll.createdAt).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </Link>
      <Link
        href={`/polls/${poll.id}`}
        rel="noopener noreferrer"
        target="_blank"
        className="w-fit"
      >
        <h2 className="text-2xl font-bold">{poll.title}</h2>
      </Link>

      <PollCardVoting poll={poll} />
    </div>
  );
}
