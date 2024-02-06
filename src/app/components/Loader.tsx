import React from "react";
import clsx from "clsx";

const Loader = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>((props, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={clsx(
        "loader h-10 w-10 border-4 border-neutral-300",
        props.className,
      )}
    />
  );
});

Loader.displayName = "Loader";

export { Loader };
