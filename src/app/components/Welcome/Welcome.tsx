import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function Welcome() {
  const { userId, user } = auth();

  console.log("!!!!!!!!!!!!userId", userId);

  // if the user is signed into clerk
  if (userId) {
    // user in db
    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    console.log("!!!!!!!!!!!!dbUser", dbUser);

    // check if they already exist in the database
    if (dbUser) {
      console.log("!!!!!!!!!!!!User already exists in the database");
      redirect("/");
    }

    // if they don't exist in the database, create a new user in db
    else {
      console.log("!!!!!!!!!!!!User does not exist in the database");
      await db.user.create({
        data: {
          id: userId,
          username:
            user?.username ?? user?.firstName ?? user?.lastName ?? "Anonymous",
          imageUrl: user?.imageUrl,
        },
      });
    }
  }

  // if the user is not signed in, redirect them to the home page
  else redirect("/");

  return <h1>WELCOME!!</h1>;
}
