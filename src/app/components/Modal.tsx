"use client";

import styles from "@/styles/modal.module.css";
import { useRouter } from "next/navigation";
import { useLockBodyScroll } from "@uidotdev/usehooks";

export function Modal({ children }: { children: React.ReactNode }) {
  useLockBodyScroll();

  const router = useRouter();

  let bgMouseUp = false;
  let bgMouseDown = false;

  return (
    <div
      className={`fixed inset-0 z-40 flex min-h-dvh w-dvw bg-black bg-opacity-65 backdrop-blur-sm ${styles["bg-in"]} scrollbar-gutter overflow-auto p-4`}
      onMouseDown={() => {
        bgMouseUp = false;
        bgMouseDown = true;
      }}
      onMouseUp={() => {
        bgMouseUp = true;
        if (bgMouseDown && bgMouseUp) router.back();
        bgMouseDown = false;
      }}
    >
      <div
        className={`mx-auto my-auto h-fit w-fit ${styles["modal-in"]}`}
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
      >
        {children}
      </div>
    </div>
  );
}
