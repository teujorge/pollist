import { PollCard } from "@/app/components/PollCard/PollCard";
import { db } from "@/database/db";
import { Tabs } from "../../components/Tabs";

export default async function MyPolls({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const polls = await db.poll.findMany({
    where: {
      authorId: params.id,
    },
    include: {
      author: true,
      votes: true,
      options: true,
    },
  });

  return (
    <div
      className={`flex-col gap-2
        ${searchParams.tab !== "votes" ? "flex" : "hidden md:flex"}
      `}
    >
      <Tabs id={params.id} tab="polls" />
      {polls.map((poll) => (
        <PollCard key={poll.id} {...poll} />
      ))}
    </div>
  );
}
