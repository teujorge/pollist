"use client";

import Link from "next/link";

export function ProfileLink({ href }: { href: string }) {
  return (
    <Link
      className="text-xs"
      href={href}
      onClick={() => {
        const button = document.querySelector("button.cl-modalCloseButton");
        if (button) (button as HTMLButtonElement).click();
      }}
    >
      Visit your profile page
    </Link>
  );
}
