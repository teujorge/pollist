import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { multiVoteOn } from "./multiVoters";
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
    <>
      <form className="italic text-green-500" action={createPollsFromList}>
        <button>create default polls</button>
      </form>
      <form className="italic text-destructive" action={deleteAllPolls}>
        <button>delete all polls</button>
      </form>
      <form className="italic text-primary" action={testCron}>
        <button>test cron jobs</button>
      </form>
      <form className="italic" action={handleMultiVoteAction}>
        <input name="pollId" placeholder="poll id" />
        <input name="voteCount" placeholder="vote count" />
        <input name="voteDistribution" placeholder="{id: count, id: count}" />
        <button>test multi vote</button>
      </form>
    </>
  );
}
