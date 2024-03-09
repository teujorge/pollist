"use client";

import { toast } from "sonner";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/database/dbRealtime";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputFile } from "../Input";
import { createPollSchema } from "./validation";
import { useForm, useFieldArray } from "react-hook-form";
import { PlusIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import {
  addImagePathToPollOption,
  createPoll,
  redirectToPoll,
} from "./actions";
import type { CreatePollFields } from "./validation";

export function CreatePollForm() {
  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control,
  });

  async function onSubmit(data: CreatePollFields) {
    // remove all files before sending to the server
    const dataToSend = { ...data };
    delete dataToSend.option1file;
    delete dataToSend.option2file;
    for (const option of dataToSend.options) {
      delete option.file;
    }

    console.log("data", data);
    console.log("dataToSend", dataToSend);

    const newPoll = await createPoll(dataToSend);

    if (!newPoll) {
      toast.error("Failed to create poll");
      return;
    }

    // upload poll option files match optionId from "newPoll" and "data" through option text (unique)
    for (const option of newPoll?.options ?? []) {
      const optionText = option.text;
      const optionData = [
        { value: data.option1, file: data.option1file as FileList },
        { value: data.option2, file: data.option2file as FileList },
        ...data.options,
      ].find((o) => o.value === optionText);

      if (!optionData?.file) {
        console.error("File not found for option", optionText);
        continue;
      }

      const file = (optionData.file as FileList)[0];
      if (!file) {
        console.error("File not found for option", optionText);
        continue;
      }

      console.log("Uploading file for option", optionText);
      const path = await uploadPollOptionFile(newPoll.id, option.id, file);
      console.log("File uploaded to", path);
    }

    await redirectToPoll(newPoll.id);
  }

  function addOption() {
    append({ value: "" });
  }

  async function uploadPollOptionFile(
    pollId: string,
    optionId: string,
    file: File,
  ) {
    if (!supabase) {
      console.error("Supabase client not found");
      throw new Error("Supabase client not found");
    }

    const extension = file.name.split(".").pop();
    const imagePath = `${pollId}/options/${optionId}/image.${extension}`;

    const { data, error } = await supabase.storage
      .from("polls")
      .upload(imagePath, file);

    await addImagePathToPollOption(optionId, imagePath);

    console.log(data, error);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data.path;
  }

  useEffect(() => {
    console.log("fields", fields);
  }, [fields]);

  useEffect(() => {
    console.log("formState", form.formState);
  }, [form.formState]);

  return (
    <form
      className="flex w-[769px] max-w-full flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-bold">Create A Poll</h1>

      <div className="flex w-full flex-col gap-4">
        <Input
          labelProps={{ text: "Title" }}
          inputProps={{
            placeholder: "E.g What should I have for lunch?",
            ...form.register("title"),
          }}
          error={form.formState.errors.title?.message}
        />
        <Input
          labelProps={{ text: "Description" }}
          inputProps={{
            placeholder: "Optional poll description.",
            ...form.register("description"),
          }}
          error={form.formState.errors.description?.message}
        />

        <div className="my-4 h-0.5 w-full rounded-full bg-accent" />

        <OptionWrapper>
          <Input
            labelProps={{ text: "Option 1" }}
            inputProps={{
              placeholder: "Enter an option.",
              ...form.register("option1"),
            }}
            error={form.formState.errors.option1?.message}
          />
          <InputFile
            wrapperProps={{ className: "w-full" }}
            inputProps={{
              className: "w-full",
              ...form.register("option1file"),
            }}
            error={
              form.formState.errors.option1file?.message as string | undefined
            }
          />
        </OptionWrapper>
        <OptionWrapper>
          <Input
            labelProps={{ text: "Option 2" }}
            inputProps={{
              placeholder: "Enter an option.",
              ...form.register("option2"),
            }}
            error={form.formState.errors.option2?.message}
          />
          <InputFile
            wrapperProps={{ className: "w-full" }}
            inputProps={{
              className: "w-full",
              ...form.register("option2file"),
              type: "file",
            }}
            error={
              form.formState.errors.option2file?.message as string | undefined
            }
          />
        </OptionWrapper>
        {fields.map((option, index) => (
          <div key={`option-${index}`} className="flex w-full flex-row">
            <OptionWrapper>
              <Input
                labelProps={{ text: `Option ${index + 3}` }}
                inputProps={{
                  placeholder: "Enter an option.",
                  // register the 'value' field of each option object
                  ...form.register(`options.${index}.value`),
                }}
                error={form.formState.errors.options?.[index]?.value?.message}
              />
              <InputFile
                wrapperProps={{ className: "w-full" }}
                inputProps={{
                  className: "w-full",
                  // register the 'file' field of each option object
                  ...form.register(`options.${index}.file`),
                }}
                error={
                  form.formState.errors.options?.[index]?.file?.message as
                    | string
                    | undefined
                }
              />
            </OptionWrapper>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mb-6 mt-2 flex max-h-8 min-h-8 min-w-8 max-w-8 items-center justify-center rounded-full transition-colors hovact:bg-destructive/20 hovact:text-destructive"
            >
              <CrossCircledIcon />
            </button>
          </div>
        ))}
      </div>

      <Button
        className="ml-auto flex flex-row items-center justify-center gap-2"
        type="button"
        variant="ghost"
        size="sm"
        onClick={addOption}
      >
        <PlusIcon /> Add Option
      </Button>

      <div className="flex h-12 items-center justify-center">
        {form.formState.isSubmitting || form.formState.isSubmitSuccessful ? (
          <Loader />
        ) : (
          <Button type="submit" variant="secondary">
            Create Poll
          </Button>
        )}
      </div>
    </form>
  );
}

function OptionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-end justify-center gap-0.5">
      {children}
    </div>
  );
}
