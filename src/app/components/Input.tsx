"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";

export function Input({
  wrapperProps,
  labelProps,
  inputProps,
  error,
}: {
  wrapperProps?: React.ComponentProps<"div">;
  labelProps?: React.ComponentProps<"label"> & { text: string };
  inputProps?: React.ComponentProps<"input">;
  error?: string;
}) {
  return (
    <div
      {...wrapperProps}
      className={cn("flex w-full flex-col p-1", wrapperProps?.className)}
    >
      {labelProps?.text && (
        <label htmlFor={inputProps?.name} {...labelProps}>
          {labelProps.text}
        </label>
      )}
      <input
        id={inputProps?.name}
        autoComplete="off"
        {...inputProps}
        className={cn(inputProps?.className, error && "!border-destructive")}
      />
      <span
        role="alert"
        className={`text-destructive origin-top transform text-xs transition-all
          ${error ? "h-5 scale-y-100 opacity-100" : "h-0 scale-y-75 opacity-0"}
        `}
      >
        {error}
      </span>
    </div>
  );
}

export function InputFile({
  wrapperProps,
  inputProps,
  error,
}: {
  wrapperProps?: React.ComponentProps<"div">;
  inputProps?: React.ComponentProps<"input">;
  error?: string;
}) {
  // State to store the selected file name
  const [fileName, setFileName] = useState<string>();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name);
    inputProps?.onChange?.(e);
  };

  return (
    <div
      {...wrapperProps}
      className={cn("flex flex-col items-start p-1", wrapperProps?.className)}
    >
      <div className="flex w-full items-center justify-center">
        <input
          id={inputProps?.name}
          {...inputProps}
          onChange={handleFileChange}
          type="file"
          className="hidden"
        />
        <label
          htmlFor={inputProps?.name}
          className={cn(
            buttonVariants({ variant: "outline" }),
            error ? "border-destructive" : "border-accent",
            "cursor-pointer gap-2",
            inputProps?.className,
          )}
        >
          {fileName ? (
            fileName
          ) : (
            <>
              Upload Image
              <UploadIcon />
            </>
          )}
        </label>
      </div>
      <span
        role="alert"
        className={`text-destructive min-w-fit origin-top transform whitespace-nowrap text-xs transition-all
          ${error ? "h-5 scale-y-100 opacity-100" : "h-0 scale-y-75 opacity-0"}
        `}
      >
        {error}
      </span>
    </div>
  );
}
