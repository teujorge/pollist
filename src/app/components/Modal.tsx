"use client";

import styles from "@/styles/modal.module.css";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLockBodyScroll } from "@uidotdev/usehooks";

export function Modal({
  ref,
  children,
  className,
  wrapperClassName,
  onClickOutside,
}: {
  ref?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  onClickOutside?: () => void;
}) {
  useLockBodyScroll();

  const router = useRouter();

  let bgMouseUp = false;
  let bgMouseDown = false;

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-40 flex h-dvh w-dvw items-center justify-center overflow-y-auto bg-background bg-opacity-75 p-4 scrollbar-gutter",
        wrapperClassName,
      )}
      style={{
        willChange: "height, transform",
      }}
      onMouseDown={() => {
        bgMouseUp = false;
        bgMouseDown = true;
      }}
      onMouseUp={() => {
        bgMouseUp = true;
        if (bgMouseDown && bgMouseUp) {
          onClickOutside ? onClickOutside() : router.back();
        }
        bgMouseDown = false;
      }}
    >
      <div
        className={cn(
          `m-auto h-[calc(100%)] w-fit overflow-y-auto overflow-x-hidden rounded-xl border border-accent bg-background p-4 sm:h-fit ${styles["modal-in"]}`,
          className,
        )}
        onMouseDown={(e) => {
          e.stopPropagation();
          bgMouseUp = false;
          bgMouseDown = false;
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          bgMouseUp = false;
          bgMouseDown = false;
        }}
        style={{
          maxWidth: "90dvw",
          maxHeight: "90dvh",
          willChange: "height, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
