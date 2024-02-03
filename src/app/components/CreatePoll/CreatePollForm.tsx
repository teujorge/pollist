"use client";

import { createPoll } from "./actions";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "./validation";
import type { CreatePollFields } from "./validation";
import { Input } from "../Input";
import { toast } from "sonner";

export function CreatePoll() {
  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control,
  });

  async function onSubmit(data: CreatePollFields) {
    if (fields.length < 2) {
      toast.warning("You need at least 2 options to create a poll");
      return;
    }

    await createPoll(data);
  }

  function addOption() {
    append({ value: "" });
  }

  function deleteOption() {
    if (fields.length === 0) return;
    remove(fields.length - 1);
  }

  return (
    <form
      className="flex w-96 flex-col overflow-auto rounded-xl border border-neutral-800 bg-black p-4 shadow-md"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Input
        labelProps={{ text: "Title" }}
        inputProps={{ ...form.register("title") }}
        error={form.formState.errors.title?.message}
      />

      <Input
        labelProps={{ text: "Description" }}
        inputProps={{ ...form.register("description") }}
        error={form.formState.errors.description?.message}
      />

      {fields.map((option, index) => {
        return (
          <Input
            key={index}
            labelProps={{ text: `Option ${index + 1}` }}
            inputProps={{
              // register the 'value' field of each option object
              ...form.register(`options.${index}.value`, { required: true }),
            }}
            error={form.formState.errors.options?.[index]?.value?.message}
          />
        );
      })}

      <div className="flex flex-row items-center justify-between">
        <button className="text-green-500" type="button" onClick={addOption}>
          add
        </button>
        <button className="text-red-500" type="button" onClick={deleteOption}>
          delete
        </button>
      </div>

      <button
        className="mx-auto w-fit rounded-lg bg-purple-500 px-4 py-2"
        type="submit"
      >
        submit
      </button>
    </form>
  );
}
