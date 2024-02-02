/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VtMN9nzQx4F
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import type { Poll, Vote, Option } from "@prisma/client";
import { db } from "@/database/db";
import { revalidateTag } from "next/cache";
import Link from "next/link";

export function PollCard(poll: Poll & { options: Option[]; votes: Vote[] }) {
  async function deletePoll(formData: FormData) {
    "use server";

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
    <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
      <h2 className="text-2xl font-bold text-white">{poll.title}</h2>

      <p className="mt-2 text-sm text-gray-200">
        Created by{" "}
        <Link className="underline" href="#">
          Poll Creator
        </Link>{" "}
        on January 1, 2022
      </p>

      <form className="mt-4 space-y-4">
        {poll.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-400" />
            <p className="text-sm text-gray-200">{option.text}</p>
            <p className="ml-auto text-sm text-gray-200">
              {poll.votes.filter((vote) => vote.optionId === option.id).length}
            </p>
          </div>
        ))}
      </form>

      <form
        key={poll.id}
        action={deletePoll}
        className="flex flex-row gap-2 p-2"
      >
        <input type="hidden" name="id" value={poll.id} />
        <button type="submit" className="text-red-500">
          -delete-
        </button>
      </form>
    </div>
  );
}
