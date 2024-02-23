"use client";

import { createComment } from "@/app/polls/actions";

export function CommentForm({
  pollId,
  parentId,
  label,
  placeholder,
}: {
  pollId: string;
  parentId: string | undefined;
  label: string | undefined;
  placeholder: string | undefined;
}) {
  async function handleSubmit(formData: FormData) {
    await createComment({
      pollId,
      parentId,
      text: formData.get("comment")?.toString(),
    });
  }

  return (
    <form className="flex w-full flex-col gap-2 p-4" action={handleSubmit}>
      {label && <label>{label}</label>}
      <div className="flex flex-row items-end gap-2">
        <textarea
          required
          name="comment"
          placeholder={placeholder}
          className="w-full"
        />
        <button className="ml-auto rounded-full px-3 py-1 text-green-500 hovact:bg-green-950">
          Submit
        </button>
      </div>
    </form>
  );
}
