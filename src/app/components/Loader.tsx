import React from "react";
import clsx from "clsx";

const Loader = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>((props, ref) => {
  return (
    <span {...props} ref={ref} className={clsx("loader", props.className)} />
  );
});

Loader.displayName = "Loader";

export { Loader };
