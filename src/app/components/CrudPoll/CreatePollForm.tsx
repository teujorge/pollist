"use client";

import { Loader } from "../Loader";
import { useEffect } from "react";
import { createPoll } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputFile } from "../Input";
import { createPollSchema } from "./validation";
import { useForm, useFieldArray } from "react-hook-form";
import { MinusCircledIcon, PlusIcon } from "@radix-ui/react-icons";
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
    append({ value: "", file: undefined });
  }

  useEffect(() => {
    console.log("formState", form.formState);
  }, [form.formState]);

  return (
    <form
      className="flex w-96 max-w-full flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div>
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
        <OptionWrapper>
          <Input
            labelProps={{ text: "Option 1" }}
            inputProps={{ ...form.register("option1") }}
            error={form.formState.errors.option1?.message}
          />
          <InputFile
            inputProps={{ ...form.register("file1") }}
            error={form.formState.errors.file1?.message}
          />
        </OptionWrapper>
        <OptionWrapper>
          <Input
            labelProps={{ text: "Option 2" }}
            inputProps={{ ...form.register("option2") }}
            error={form.formState.errors.option2?.message}
          />
          <InputFile
            inputProps={{ ...form.register("file2") }}
            error={form.formState.errors.file2?.message}
          />
        </OptionWrapper>
        {fields.map((option, index) => (
          <OptionWrapper key={`option-${index}`}>
            <Input
              labelProps={{ text: `Option ${index + 3}` }}
              inputProps={{
                // register the 'value' field of each option object
                ...form.register(`options.${index}.value`),
              }}
              error={form.formState.errors.options?.[index]?.value?.message}
            />
            <InputFile
              inputProps={{
                // register the 'file' field of each option object
                ...form.register(`options.${index}.file`),
              }}
              error={form.formState.errors.options?.[index]?.file?.message}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="mb-6 flex max-h-8 min-h-8 min-w-8 max-w-8 items-center justify-center rounded-full text-red-500 transition-colors hovact:bg-red-500/25"
            >
              <MinusCircledIcon />
            </button>
          </OptionWrapper>
        ))}
      </div>

      <button
        className="ml-auto flex h-fit w-fit flex-row items-center justify-center rounded-full px-3 py-1 text-green-500 transition-colors hovact:bg-green-500/25"
        type="button"
        onClick={addOption}
      >
        <PlusIcon /> Add Option
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

function OptionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-end justify-center">{children}</div>
  );
}
