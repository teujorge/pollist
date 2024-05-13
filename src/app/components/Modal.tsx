"use client";

import styles from "@/styles/modal.module.css";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { forwardRef, useImperativeHandle, useRef } from "react";

const Modal = forwardRef(function _Modal(
  {
    children,
    className,
    wrapperClassName,
    onClickOutside,
  }: {
    children: React.ReactNode;
    className?: string;
    wrapperClassName?: string;
    onClickOutside?: () => void;
  },
  ref: React.ForwardedRef<HTMLElement>,
) {
  useLockBodyScroll();

  const router = useRouter();

  let bgMouseUp = false;
  let bgMouseDown = false;

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-40 flex h-dvh w-dvw items-center justify-center overflow-y-auto bg-background bg-opacity-65 p-4 backdrop-blur-sm scrollbar-gutter",
        wrapperClassName,
      )}
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
          `m-auto h-fit w-fit overflow-y-auto overflow-x-hidden rounded-xl border border-accent bg-background p-4 ${styles["modal-in"]}`,
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
        }}
      >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export { Modal };
