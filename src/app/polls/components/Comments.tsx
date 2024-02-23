import { db } from "@/database/db";
import { createComment } from "../actions";

export async function Comments({ pollId }: { pollId: string }) {
  const comments = await db.comment.findMany({
    where: {
      pollId: pollId,
    },
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });

  async function handleSubmit(formData: FormData) {
    "use server";
    await createComment({
      pollId,
      text: formData.get("comment")?.toString(),
    });
  }

  return (
    <>
      <h1 className="text-4xl">Comments</h1>

      <form className="flex flex-col items-center" action={handleSubmit}>
        <label>Write a comment</label>
        <textarea required name="comment" placeholder="Write a comment" />
        <button className="rounded-full px-3 py-1 text-green-500 hovact:bg-green-900">
          Submit
        </button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id}>
          <p>author={comment.author.username}</p>
          <p>text={comment.text}</p>
          <p>likes={comment._count.likes}</p>
          <p>replies={comment._count.replies}</p>
        </div>
      ))}
    </>
  );
}
