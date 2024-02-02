"use client";

import { useEffect, useState } from "react";
import { createPoll } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "./validation";
import type { CreatePollFields } from "./validation";
import { Input } from "../Input";
import { useUser } from "@clerk/nextjs";

export function CreatePoll() {
  const { user } = useUser();

  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      userId: user?.id,
    },
  });

  const [numOfOptions, setNumOfOptions] = useState(2);

  function deleteOption() {
    if (numOfOptions <= 2) return;
    setNumOfOptions(numOfOptions - 1);
  }

  function addOption() {
    setNumOfOptions(numOfOptions + 1);
  }

  const optionInputs: React.ReactNode[] = [];

  for (let index = 1; index <= numOfOptions; index++) {
    optionInputs.push(
      <Input
        key={index}
        labelProps={{ text: `Option ${index}` }}
        inputProps={{
          ...form.register(`option${index}` as keyof CreatePollFields),
        }}
        error={
          form.formState.errors[`option${index}` as keyof CreatePollFields]
            ?.message
        }
      />,
    );
  }

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <form
      className="flex w-96 flex-col overflow-auto rounded-xl border border-neutral-800 bg-black p-4 shadow-md"
      onSubmit={form.handleSubmit(async (data) => await createPoll(data))}
    >
      <input type="hidden" {...form.register("userId")} />

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

      {optionInputs.map((option) => {
        return option;
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
