"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { House } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

export function HomeItem() {
  const pathname = usePathname();

  return (
    <Link
      key="header-home"
      href="/"
      scroll={false}
      className={cn(
        "underline decoration-transparent underline-offset-4",
        pathname === "/" && "text-primary decoration-primary",
      )}
    >
      <span className="hidden sm:inline">Home</span>
      <span className="sm:hidden">
        <House size={26} />
      </span>
    </Link>
  );
}
