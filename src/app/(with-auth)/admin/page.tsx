import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
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
    </>
  );
}
