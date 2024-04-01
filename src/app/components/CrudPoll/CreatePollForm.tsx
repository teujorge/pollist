"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { supabase } from "@/database/supabase";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputFile } from "../Input";
import { createPollSchema } from "./validation";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusIcon,
  Cross2Icon,
  InfoCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import {
  createPoll,
  redirectToPoll,
  addImagePathToPollOption,
} from "./actions";
import type { Metadata } from "next";
import type { CreatePollFields } from "./validation";

export function CreatePollForm({
  showBackButton,
  tooltipBoundary,
}: {
  showBackButton?: boolean;
  tooltipBoundary?: HTMLElement;
}) {
  const router = useRouter();

  const [createPollSuccess, setCreatePollSuccess] = useState<
    boolean | undefined
  >(undefined);

  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
    mode: "onChange",
    defaultValues: {
      private: false,
      anonymous: false,
    },
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

    setCreatePollSuccess(undefined);

    try {
      const newPoll = await createPoll(dataToSend);

      if (!newPoll) {
        toast.error("Failed to create poll");
        return;
      }

      setCreatePollSuccess(true);

      // upload poll option files match optionId from "newPoll" and "data" through option text (unique)
      for (const option of newPoll?.options ?? []) {
        const optionText = option.text;
        const optionData = [
          { value: data.option1, file: data.option1file as FileList },
          { value: data.option2, file: data.option2file as FileList },
          ...data.options,
        ].find((o) => o.value === optionText);

        if (!optionData?.file) {
          continue;
        }

        const file = (optionData.file as FileList)[0];
        if (!file) {
          continue;
        }

        await uploadPollOptionFile(newPoll.id, option.id, file);
      }

      await redirectToPoll(newPoll.id);
    } catch (error) {
      setCreatePollSuccess(false);

      const message =
        error instanceof Error ? error.message : "Failed to create poll";
      toast.error(message);
    }
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
      throw new Error("Supabase client not found");
    }

    const extension = file.name.split(".").pop();
    const imagePath = `${pollId}/options/${optionId}/image.${extension}`;

    const { data, error } = await supabase.storage
      .from("polls")
      .upload(imagePath, file);

    await addImagePathToPollOption(optionId, imagePath);

    if (error) {
      throw new Error(error.message);
    }

    return data.path;
  }

  return (
    <>
      {showBackButton && (
        <button
          className="absolute right-4 top-4"
          onClick={() => router.back()}
        >
          <Cross2Icon />
        </button>
      )}
      <form
        className={cn(
          "flex w-[769px] max-w-full flex-col gap-4 p-2 transition-opacity",
          (form.formState.isSubmitting || createPollSuccess) &&
            "pointer-events-none opacity-50",
        )}
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

        <div className="p-2">
          <h3 className="py-1 text-lg font-semibold">Advanced Settings</h3>
          <div className="flex flex-col items-center rounded-lg bg-accent/30 p-2 [&>div>label]:w-full [&>div>label]:text-end [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div]:space-x-2 [&>div]:p-2">
            <div>
              <Controller
                name="private"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    id="private-poll"
                    defaultChecked={false}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label htmlFor="private-poll">Private Poll (beta)</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon />
                </TooltipTrigger>
                <TooltipContent align="end" collisionBoundary={tooltipBoundary}>
                  <p>
                    <span className="font-semibold">Private Polls:</span> Only
                    visible on the creator&apos;s profile, these polls can be
                    easily shared with a select audience by distributing the
                    poll&apos;s URL. Beta feature, please report any bugs.{" "}
                    <span className="text-yellow-500">
                      Note: Anyone with the poll&apos;s URL can access it.
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <span className="h-0.5 w-full rounded-full bg-background" />

            <div>
              <Controller
                name="anonymous"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    id="anonymous-poll"
                    defaultChecked={false}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label htmlFor="anonymous-poll">Anonymous Poll (beta)</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon />
                </TooltipTrigger>
                <TooltipContent align="end" collisionBoundary={tooltipBoundary}>
                  <p>
                    <span className="font-semibold">Anonymous Polls:</span>{" "}
                    Display without linking to any author, perfect for posting
                    questions anonymously. Beta feature, please report any bugs.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex h-12 items-center justify-center">
          {form.formState.isSubmitting || createPollSuccess ? (
            <Loader />
          ) : (
            <Button type="submit" variant="secondary">
              Create Poll
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

function OptionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-end justify-center gap-0.5">
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Create Poll",
  description: "Create a poll to share with your friends and family.",
};
