import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { delMultiUsers, multiVoteOn, runModerator } from "./actions";
import { createPollsFromList, deleteAllPolls, testCron } from "./defaultPolls";

export default async function UserPage() {
  const { userId: myId } = auth();

  if (process.env.NODE_ENV !== "development") {
    console.error("This function is only available in development mode.");
    return notFound();
  }

  if (process.env.ADMIN_ID !== myId) {
    console.error("Bad ADMIN_ID.");
    return notFound();
  }

  async function handleMultiVoteAction(formData: FormData) {
    "use server";

    const pollId = formData.get("pollId") as string;
    const voteCount = Number(formData.get("voteCount"));
    const voteDistribution =
      formData.get("voteDistribution") === ""
        ? undefined
        : (JSON.parse(formData.get("voteDistribution") as string) as Record<
            string,
            number
          >);

    await multiVoteOn({
      pollId,
      voteCount,
      voteDistribution,
    });
  }

  return (
    <main className="flex flex-col gap-8">
      {/* create all polls from generated poll list */}
      <form className="italic text-green-500" action={createPollsFromList}>
        <button>create default polls</button>
      </form>

      {/* delete ALL polls */}
      <form className="italic text-destructive" action={deleteAllPolls}>
        <button>delete all polls</button>
      </form>

      {/* test cron job */}
      <form className="italic text-primary" action={testCron}>
        <button>test cron jobs</button>
      </form>

      {/* fake multiple votes with test users */}
      <form className="italic" action={handleMultiVoteAction}>
        <input name="pollId" placeholder="poll id" />
        <input name="voteCount" placeholder="vote count" />
        <input name="voteDistribution" placeholder="{id: count, id: count}" />
        <button>test multi vote</button>
      </form>

      {/* delete test users */}
      <form action={delMultiUsers}>
        <button>del test users</button>
      </form>

      {/* go through each existing poll and run the moderator */}
      <form action={runModerator}>
        <button>run moderator</button>
      </form>
    </main>
  );
}
