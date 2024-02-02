"use client";

import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur"
      onClick={() => router.back()}
    >
      <div className="h-fit w-fit" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
