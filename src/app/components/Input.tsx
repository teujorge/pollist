import { cn } from "@/lib/utils";
import { UploadIcon } from "@radix-ui/react-icons";

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
        className={cn(inputProps?.className, error && "border-red-500")}
      />
      <span
        role="alert"
        className={`origin-top transform text-sm text-red-500 transition-all
          ${error ? "h-5 min-h-5 scale-y-100 opacity-100" : "h-0 max-h-0 scale-y-75 opacity-0"}
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
  return (
    <div
      {...wrapperProps}
      className={cn("flex flex-col p-1", wrapperProps?.className)}
    >
      <div className="flex items-center justify-center">
        <input
          id={inputProps?.name}
          {...inputProps}
          type="file"
          className="hidden"
        />
        <label
          htmlFor={inputProps?.name}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-purple-500 transition-colors hovact:bg-purple-500/25"
        >
          <UploadIcon />
        </label>
      </div>
      <span
        role="alert"
        className={`min-h-5 origin-top transform text-sm text-red-500 transition-all
          ${error ? "scale-y-100 opacity-100" : "scale-y-75 opacity-0"}
        `}
      >
        {error}
      </span>
    </div>
  );
}
