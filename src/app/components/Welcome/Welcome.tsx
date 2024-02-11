import Link from "next/link";
import { Confetti } from "./Confetti";
import { auth } from "@clerk/nextjs";

export async function Welcome() {
  const { userId } = auth();

  return (
    <>
      <Confetti />
      <h1>WELCOME!!</h1>
      <Link href="/polls">Go to polls</Link>
      <Link href="/polls/create">Create a poll</Link>
      <Link href={`/users/${userId}`}>Go to your profile</Link>
    </>
  );
}
