import React from "react";
import { twMerge } from "tailwind-merge";

const Loader = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>((props, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={twMerge(
        "loader h-10 w-10 border-4 border-neutral-300",
        props.className,
      )}
    />
  );
});

Loader.displayName = "Loader";

export { Loader };
