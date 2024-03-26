import React from "react";
import { cn } from "@/lib/utils";

const Loader = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>((props, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={cn(
        "loader h-10 w-10 border-[3px] border-foreground",
        props.className,
      )}
    />
  );
});

Loader.displayName = "Loader";

export { Loader };
