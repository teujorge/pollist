import React from "react";
import { cn } from "@/lib/utils";

export function Loader({ ...props }: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn(
        "loader h-10 w-10 border-[3px] border-foreground",
        props.className,
      )}
    />
  );
}
