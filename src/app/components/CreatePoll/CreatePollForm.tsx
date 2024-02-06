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
    console.log(data);

    if (fields.length === 0) {
      toast.warning("You need at least 2 options to create a poll");
      append({ value: "" });
      append({ value: "" });

      return;
    } else if (fields.length === 1) {
      toast.warning("Please add another option to create a poll");
      append({ value: "" });
      return;
    }

    await createPoll(data);
  }

  function addOption() {
    append({ value: "" });
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
          <div className=" flex flex-row ">
            <Input
              key={index}
              labelProps={{ text: `Option ${index + 1}` }}
              inputProps={{
                // register the 'value' field of each option object
                ...form.register(`options.${index}.value`, {
                  required: true,
                }),
              }}
              error={form.formState.errors.options?.[index]?.value?.message}
            />

            {index === 0 || index === 1 ? (
              ""
            ) : (
              <div className="flex  justify-end">
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <svg
                    className="h-8 w-8 fill-red-500 stroke-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                  </svg>
                  {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button className="my-4 text-green-500" type="button" onClick={addOption}>
        + add option
      </button>

      <button
        className="mx-auto w-fit rounded-lg bg-purple-500 px-4 py-2"
        type="submit"
      >
        submit
      </button>
    </form>
  );
}
