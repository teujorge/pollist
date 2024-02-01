import { db } from "@/server/db";
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
    <main>
      {data.map((post) => (
        <form
          key={post.id}
          action={deletePost}
          className="flex flex-row gap-2 p-2"
        >
          <input type="hidden" name="id" value={post.id} />
          <div>{post.name}</div>
          <button type="submit" className="text-red-500">
            del
          </button>
        </form>
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
