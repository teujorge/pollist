import { cn } from "@/lib/utils";
import React from "react";

const Loader = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>((props, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={cn(
        "loader h-10 w-10 border-4 border-neutral-300",
        props.className,
      )}
    />
  );
});

Loader.displayName = "Loader";

export { Loader };
