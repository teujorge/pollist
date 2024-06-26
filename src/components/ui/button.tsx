import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap outline-none rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hovact:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hovact:bg-destructive/80",
        outline:
          "border border-accent bg-background shadow-sm hovact:bg-accent-dark text-foreground",
        secondary:
          "bg-secondary/80 text-secondary-foreground shadow-sm hovact:bg-secondary",
        ghost: "hovact:bg-accent-dark",
        link: "text-primary underline-offset-4 hovact:underline",
        popover:
          "hovact:bg-accent hovact:text-accent-foreground w-full rounded-none flex justify-start gap-2 h-8 px-3 text-xs",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
    />
  );
}
