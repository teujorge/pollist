import { db } from "@/database/db";
import Link from "next/link";
import { Tabs } from "../../components/Tabs";
import { PollCard } from "@/app/components/PollCard/PollCard";

export default async function MyVotes({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const votes = await db.vote.findMany({
    where: {
      voterId: params.id,
    },
    include: {
      poll: {
        include: {
          options: true,
          votes: true,
          author: true,
        },
      },
      option: true,
    },
  });

  return (
    <div
      className={`w-1/2 flex-grow flex-col gap-2
      ${searchParams.tab === "votes" ? "flex" : "hidden md:flex"}
    `}
    >
      <Tabs id={params.id} tab="votes" />
      <div className="flex flex-col gap-2 overflow-y-auto rounded-xl border border-neutral-800 p-2">
        {votes.map((vote) => (
          <>
            <Link key={vote.id} href={`/polls/${vote.pollId}`}>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-md">
                <h2>
                  <span className="font-extrabold text-purple-500">
                    Title:{" "}
                  </span>
                  {vote.poll.title}
                </h2>
                <p>
                  <span className="font-extrabold text-purple-500">Vote:</span>{" "}
                  {vote.option.text}
                </p>
              </div>
            </Link>
            <PollCard key={vote.poll.id} poll={vote.poll} />
          </>
        ))}
      </div>
    </div>
  );
}
