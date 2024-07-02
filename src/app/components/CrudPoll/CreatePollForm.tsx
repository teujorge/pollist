"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "../Loader";
import { useApp } from "@/app/(with-auth)/app";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/server/supabase";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { moderateImage } from "@/app/(with-auth)/admin/moderation";
import { Input, InputFile } from "../Input";
import { createPollSchema } from "./validation";
import { useEffect, useState } from "react";
import { Plus, XCircle, Info, X } from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { createPoll, addImagePathToPollOption } from "./actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Metadata } from "next";
import type { CreatePollFields } from "./validation";

export function CreatePollForm({
  autoPopRoute,
  showBackButton,
  popoverBoundary,
  className,
  wrapperClassName,
  onCreatePollStart,
  onCreatePollEnd,
}: {
  autoPopRoute?: boolean;
  showBackButton?: boolean;
  popoverBoundary?: HTMLElement;
  className?: string;
  wrapperClassName?: string;
  onCreatePollStart?: () => void;
  onCreatePollEnd?: (success: boolean) => void;
}) {
  const router = useRouter();
  const { userSettings } = useApp();

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

  const [options, setOptions] = useState<
    Record<
      string,
      {
        id: string;
        value: string;
        file: FileList | undefined;
      }
    >
  >({});

  useEffect(() => {
    // Update field files when fields change
    setOptions((prev) => {
      const updatedFieldFiles = { ...prev };

      // Add new entries for new fields
      fields.forEach((field) => {
        if (!updatedFieldFiles[field.id]) {
          updatedFieldFiles[field.id] = {
            id: field.id,
            value: field.value,
            file: undefined,
          };
        }
      });

      // Remove entries for fields that no longer exist
      Object.keys(updatedFieldFiles).forEach((key) => {
        if (!fields.some((field) => field.id === key)) {
          delete updatedFieldFiles[key];
        }
      });

      return updatedFieldFiles;
    });
  }, [fields]);

  async function onSubmit(data: CreatePollFields) {
    const toastId = toast.promise(createPollWithImages(data), {
      loading: (
        <div className="flex w-full flex-row items-center justify-between">
          Creating poll...
          <Loader className="h-5 w-5 border-2 border-background" />
        </div>
      ),
      error: "Failed to create poll",
      success: (pollId) => {
        return (
          <div className="flex w-full flex-row items-center justify-between">
            Poll created!
            <Link
              href={`/polls/${pollId}`}
              onClick={() => toast.dismiss(toastId)}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "h-6 cursor-pointer hovact:text-foreground",
              )}
            >
              View
            </Link>
          </div>
        );
      },
    });

    if (autoPopRoute) router.back();
  }

  async function createPollWithImages(data: CreatePollFields): Promise<string> {
    onCreatePollStart?.();

    // remove all files before sending to the server
    const dataToSend = { ...data };
    delete dataToSend.option1file;
    delete dataToSend.option2file;
    for (const option of dataToSend.options) {
      delete option.file;
    }

    data.options = Object.values(options);

    setCreatePollSuccess(undefined);

    try {
      const newPoll = await createPoll(dataToSend);

      if (!newPoll) {
        toast.error("Failed to create poll");
        throw new Error("Failed to create poll");
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
        if (!file) continue;

        await uploadPollOptionFile(newPoll.id, option.id, file);
      }

      onCreatePollEnd?.(true);
      return newPoll.id;
    } catch (error) {
      setCreatePollSuccess(false);
    }

    onCreatePollEnd?.(false);
    throw new Error("Failed to create poll");
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

    if (userSettings.tier === "FREE") {
      toast.error("You must be on a paid plan to upload images");
      return;
    }

    // check moderator
    const base64Image = await encodeImageToBase64(file);
    const isSensitive = await moderateImage(base64Image);
    console.log("isSensitive:", isSensitive);

    if (isSensitive) {
      toast.warning(`The image ${file.name} is inappropriate.`);
      return;
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
    <div
      className={cn(
        "flex w-full flex-col items-center overflow-y-auto",
        wrapperClassName,
      )}
    >
      {showBackButton && (
        <button
          className="absolute right-4 top-4"
          onClick={() => router.back()}
        >
          <X size={20} />
        </button>
      )}
      <form
        className={cn(
          "flex max-h-full w-full max-w-[769px] flex-col gap-4 p-2 transition-opacity",
          (form.formState.isSubmitting || createPollSuccess) &&
            "pointer-events-none opacity-50",
          className,
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setOptions((prev) => ({
                      ...prev,
                      [option.id]: {
                        id: option.id,
                        value,
                        file: prev[option.id]?.file,
                      },
                    }));
                  }}
                  error={form.formState.errors.options?.[index]?.value?.message}
                />
                <InputFile
                  wrapperProps={{ className: "w-full" }}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setOptions((prev) => ({
                        ...prev,
                        [option.id]: {
                          id: option.id,
                          value: prev[option.id]?.value ?? option.value,
                          file: files,
                        },
                      }));
                    }
                  }}
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
                <XCircle size={20} />
              </button>
            </div>
          ))}
        </div>

        <Button
          className="ml-auto flex flex-row items-center justify-center gap-2"
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={addOption}
        >
          <Plus size={15} /> Add Option
        </Button>

        <div className="p-2">
          <h3 className="py-1 text-lg font-semibold">Advanced Settings</h3>
          <div className="flex flex-col items-center rounded-lg bg-accent-dark p-2 [&>div>label]:w-full [&>div>label]:text-end [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div]:space-x-2 [&>div]:p-2">
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
              <label htmlFor="private-poll">Private Poll</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Info size={20} />
                </PopoverTrigger>
                <PopoverContent align="end" collisionBoundary={popoverBoundary}>
                  <p className="p-4">
                    <span className="font-semibold">Private Polls:</span> Only
                    visible on the creator&apos;s profile, these polls can be
                    easily shared with a select audience by distributing the
                    poll&apos;s URL.{" "}
                    <span className="text-yellow-500">
                      Note: Anyone with the poll&apos;s URL can access it.
                    </span>
                  </p>
                </PopoverContent>
              </Popover>
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
              <label htmlFor="anonymous-poll">Anonymous Poll</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Info size={20} />
                </PopoverTrigger>
                <PopoverContent align="end" collisionBoundary={popoverBoundary}>
                  <p className="p-4">
                    <span className="font-semibold">Anonymous Polls:</span>{" "}
                    Display without linking to any author, perfect for posting
                    questions anonymously.
                  </p>
                </PopoverContent>
              </Popover>
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
    </div>
  );
}

function OptionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-end justify-center gap-0.5">
      {children}
    </div>
  );
}

function encodeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      // The result attribute contains the data as a Base64-encoded string
      const base64String = event.target!.result as string;
      resolve(base64String);
    };

    reader.onerror = function (error) {
      reject(
        new Error(
          `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
}

export const metadata: Metadata = {
  title: "Create Poll",
  description: "Create a poll to share with your friends and family.",
};
