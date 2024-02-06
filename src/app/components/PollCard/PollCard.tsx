import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import Image from "next/image";
import type { PollDetails } from "./types";
import { deletePoll } from "./actions";

export function PollCard(poll: PollDetails) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
      <Link href={`/polls/${poll.id}`} className="w-fit">
        <h2 className="text-2xl font-bold">{poll.title}</h2>
      </Link>

      <Link
        href={`/users/${poll.authorId}`}
        className="flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 transition-colors hover:bg-purple-500"
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

      <PollCardVoting {...poll} />

      {/* temporary for dev & debugging */}
      <form
        key={poll.id}
        action={deletePoll}
        className="flex flex-row gap-2 p-2"
      >
        <input type="hidden" name="id" value={poll.id} />
        <input type="hidden" name="authorId" value={poll.authorId} />
        <SignedIn>
          <button type="submit" className="text-red-500">
            -delete-
          </button>
        </SignedIn>
      </form>
    </div>
  );
}
