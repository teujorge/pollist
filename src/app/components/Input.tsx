"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { UploadSimple } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";

export function Input({
  wrapperProps,
  labelProps,
  inputProps,
  error,
  onChange,
}: {
  wrapperProps?: React.ComponentProps<"div">;
  labelProps?: React.ComponentProps<"label"> & { text: string };
  inputProps?: React.ComponentProps<"input">;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        onChange={(e) => {
          onChange?.(e);
          inputProps?.onChange?.(e);
        }}
        className={cn(inputProps?.className, error && "!border-destructive")}
      />
      <span
        role="alert"
        className={`origin-top transform text-xs text-destructive transition-all
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
  onChange,
}: {
  wrapperProps?: React.ComponentProps<"div">;
  inputProps?: React.ComponentProps<"input">;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // State to store the selected file name
  const [fileName, setFileName] = useState<string>();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
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
              <UploadSimple size={15} />
            </>
          )}
        </label>
      </div>
      <span
        role="alert"
        className={`min-w-fit origin-top transform whitespace-nowrap text-xs text-destructive transition-all
          ${error ? "h-5 scale-y-100 opacity-100" : "h-0 scale-y-75 opacity-0"}
        `}
      >
        {error}
      </span>
    </div>
  );
}
