import { db } from "@/server/db";
import { PollCard } from "./components/PollCard";
import { revalidateTag } from "next/cache";

export default async function HomePage() {
  const data = await db.post.findMany({});

  async function createPost(formData: FormData) {
    "use server";

    const newPost = (formData.get("post") ?? "") as string;

    if (newPost === "") return;

    await db.post.create({
      data: {
        name: newPost,
      },
    });

    revalidateTag("/");
  }

  return (
    <main>
      {data.map((post) => (
        <PollCard key={post.id} id={post.id} name={post.name} />
      ))}

      <form action={createPost}>
        <input
          id="post"
          name="post"
          className="rounded-lg border border-blue-500"
        />
        <button type="submit">submit</button>
      </form>
    </main>
  );
}
