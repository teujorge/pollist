import { db } from "@/database/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export function CreatePoll() {
  async function createPoll(formData: FormData) {
    "use server";

    const title = (formData.get("title") ?? "") as string;
    const description = (formData.get("description") ?? "") as string;

    const option1 = (formData.get("option1") ?? "") as string;
    const option2 = (formData.get("option2") ?? "") as string;

    if (title === "") return;
    if (description === "") return;

    const createdPoll = await db.poll.create({
      data: {
        title,
        description,
        options: {
          create: [{ text: option1 }, { text: option2 }],
        },
      },
    });

    if (createdPoll) {
      redirect(`/post/${createdPoll.id}`);
    }
  }

  return (
    <form
      className="flex w-96 flex-col gap-4 rounded-xl border border-neutral-800 bg-black p-4 shadow-md"
      action={createPoll}
    >
      <label htmlFor="title">Title</label>
      <input id="title" name="title" />

      <label htmlFor="description">Description</label>
      <input id="description" name="description" />

      <label htmlFor="option1">Option 1</label>
      <input id="option1" name="option1" />

      <label htmlFor="option2">Option 2</label>
      <input id="option2" name="option2" />

      <button type="submit">submit</button>
    </form>
  );
}
