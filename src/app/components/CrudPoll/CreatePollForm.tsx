"use client";

import { createPoll } from "./actions";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "./validation";
import { Input } from "../Input";
import { CancelSvg } from "@/app/svgs/CancelSvg";
import { Loader } from "../Loader";
import type { CreatePollFields } from "./validation";

export function CreatePollForm() {
  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control,
  });

  async function onSubmit(data: CreatePollFields) {
    console.log(data);
    await createPoll(data);
  }

  function addOption() {
    append({ value: "" });
  }

  return (
    <form
      className="flex w-96 max-w-full flex-col overflow-y-auto"
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

      <Input
        labelProps={{ text: "Option 1" }}
        inputProps={{ ...form.register("option1") }}
        error={form.formState.errors.option1?.message}
      />

      <Input
        labelProps={{ text: "Option 2" }}
        inputProps={{ ...form.register("option2") }}
        error={form.formState.errors.option2?.message}
      />

      {fields.map((option, index) => (
        <div
          key={`option-${index}`}
          className="flex flex-row items-end justify-center gap-1"
        >
          <Input
            labelProps={{ text: `Option ${index + 3}` }}
            inputProps={{
              // register the 'value' field of each option object
              ...form.register(`options.${index}.value`),
            }}
            error={form.formState.errors.options?.[index]?.value?.message}
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="mb-6 flex h-fit w-fit items-center justify-center rounded-full !bg-opacity-25 transition-colors hovact:bg-red-500"
          >
            <CancelSvg className="h-8 w-8 fill-red-500" />
          </button>
        </div>
      ))}

      <button
        className="mb-4 ml-auto flex h-fit w-fit flex-row items-center justify-center rounded-full !bg-opacity-25 px-3 py-1 text-green-500 transition-colors hovact:bg-green-500"
        type="button"
        onClick={addOption}
      >
        + Add Option
      </button>

      <div className="flex h-12 items-center justify-center">
        {form.formState.isSubmitting || form.formState.isSubmitSuccessful ? (
          <Loader />
        ) : (
          <button className="rounded-lg bg-purple-500 px-4 py-2" type="submit">
            Submit
          </button>
        )}
      </div>
    </form>
  );
}
