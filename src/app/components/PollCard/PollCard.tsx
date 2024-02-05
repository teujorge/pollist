/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VtMN9nzQx4F
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { db } from "@/database/db";
import { revalidateTag } from "next/cache";
import Link from "next/link";
import { SignedIn, auth } from "@clerk/nextjs";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import Image from "next/image";

export async function PollCard({ pollId }: { pollId: string }) {
  // // delay 5 seconds to simulate slow response
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: { votes: true, options: true, author: true },
  });

  if (poll === null) return null;

  async function deletePoll(formData: FormData) {
    "use server";

    if (poll === null) return;

    const { userId } = auth();

    if (!userId || userId !== poll.author.id) {
      throw new Error("You are not authorized to delete this poll");
    }

    const id = (formData.get("id") ?? "") as string;

    if (id === "") return;

    // parallel delete all votes and options
    await Promise.all([
      db.vote.deleteMany({ where: { pollId: id } }),
      db.option.deleteMany({ where: { pollId: id } }),
    ]);

    // safely delete poll without relation errors
    await db.poll.delete({ where: { id: id } });

    revalidateTag("/");
  }

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
          <desc className="text-neutral-200">{poll.author.username}</desc>
          <desc className="text-neutral-400">
            {new Date(poll.createdAt).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </desc>
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
        <SignedIn>
          <button type="submit" className="text-red-500">
            -delete-
          </button>
        </SignedIn>
      </form>
    </div>
  );
}
