/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VtMN9nzQx4F
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { db } from "@/server/db";
import { revalidateTag } from "next/cache";
import Link from "next/link";

type PollCardProps = {
  id: number;
  name: string;
};

export function PollCard(poll: PollCardProps) {
  async function deletePost(formData: FormData) {
    "use server";

    const id = (formData.get("id") ?? "") as string;

    if (id === "") return;

    await db.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidateTag("/");
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
      <h2 className="text-2xl font-bold text-white">Poll Title</h2>
      <p className="mt-2 text-sm text-gray-200">
        Created by{" "}
        <Link className="underline" href="#">
          Poll Creator
        </Link>{" "}
        on January 1, 2022
      </p>
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-gray-400" />
          <p className="text-sm text-gray-200">Option 1</p>
          <p className="ml-auto text-sm text-gray-200">100 Votes</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-gray-400" />
          <p className="text-sm text-gray-200">Option 2</p>
          <p className="ml-auto text-sm text-gray-200">50 Votes</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-gray-400" />
          <p className="text-sm text-gray-200">Option 3</p>
          <p className="ml-auto text-sm text-gray-200">25 Votes</p>
        </div>
      </div>

      <form
        key={poll.id}
        action={deletePost}
        className="flex flex-row gap-2 p-2"
      >
        <input type="hidden" name="id" value={poll.id} />
        <div>{poll.name}</div>
        <button type="submit" className="text-red-500">
          del
        </button>
      </form>
    </div>
  );
}
