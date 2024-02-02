"use client";

import { useEffect, useState } from "react";
import { createPoll } from "./actions";
import { useForm } from "react-hook-form";
import { CreatePollFields, createPollSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreatePoll() {
  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
    defaultValues: { title: "hello" },
  });

  const [numOfOptions, setNumOfOptions] = useState(2);

  async function onFormSubmit(fields: CreatePollFields) {
    await createPoll(fields);
  }

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
      <>
        <label htmlFor={`option${index}`}>Option {index}</label>
        <input {...form.register(`option${index}` as keyof CreatePollFields)} />
      </>,
    );
  }

  useEffect(() => {
    console.log(form.getValues(), form.formState);
  }, [form.formState]);

  return (
    <form
      className="flex w-96 flex-col gap-4 rounded-xl border border-neutral-800 bg-black p-4 shadow-md"
      onSubmit={form.handleSubmit(onFormSubmit)}
    >
      <label htmlFor="title">Title</label>
      <input {...form.register("title")} />

      <label htmlFor="description">Description</label>
      <input {...form.register("description")} />

      {optionInputs.map((option) => {
        return option;
      })}

      <button type="button" onClick={addOption}>
        add
      </button>

      <button type="button" onClick={deleteOption}>
        delete
      </button>

      <button type="submit">submit</button>
    </form>
  );
}
