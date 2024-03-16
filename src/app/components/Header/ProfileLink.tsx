import Link from "next/link";
import { currentUser } from "@clerk/nextjs";

export async function ProfileLink() {
  const user = await currentUser();
  return user ? <Link href={`/users/${user.username}`}>Me</Link> : null;
}
