export function Input({
  wrapperProps,
  labelProps,
  inputProps,
  error,
}: {
  wrapperProps?: React.ComponentProps<"div">;
  labelProps?: React.ComponentProps<"label"> & { text: string };
  inputProps: React.ComponentProps<"input">;
  error?: string;
}) {
  return (
    <div className="flex w-full flex-col p-1" {...wrapperProps}>
      {labelProps?.text && (
        <label htmlFor={inputProps.name} {...labelProps}>
          {labelProps.text}
        </label>
      )}
      <input
        id={inputProps.name}
        autoComplete="off"
        className={error && "border-red-500"}
        {...inputProps}
      />
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
