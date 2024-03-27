"use client";

import Link from "next/link";
import { IconSvg } from "@/app/svgs/IconSvg";
import { useState } from "react";
import { ProfileLink } from "./ProfileLink";
import { SignInButton } from "@clerk/nextjs";
import { DrawerTrigger, DrawerContent, Drawer } from "@/components/ui/drawer";
import {
  HomeIcon,
  HamburgerMenuIcon,
  CardStackPlusIcon,
} from "@radix-ui/react-icons";

export function MobileHeader({ userId }: { userId: string | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-row gap-3 sm:hidden">
      <Drawer
        open={isOpen}
        onOpenChange={setIsOpen}
        direction="right"
        shouldScaleBackground
      >
        <DrawerTrigger>
          <HamburgerMenuIcon className="h-5 w-5" />
        </DrawerTrigger>

        <DrawerContent className="bottom-0 left-auto right-0 top-0 flex h-dvh w-4/5 max-w-96 flex-col items-end justify-between gap-3 overflow-y-auto rounded-bl-xl rounded-tr-none px-6 py-8">
          <div className="absolute left-3 top-1/2 h-24 w-1.5 -translate-y-1/2 rounded-full bg-accent" />

          <nav className="flex flex-col items-end gap-3 text-2xl font-semibold">
            <Link
              href="/"
              scroll={false}
              className="h-14 w-14 [&>*]:font-semibold [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
              onClick={() => setIsOpen(false)}
            >
              <IconSvg className="h-full w-full" />
            </Link>

            <div className="h-2" />

            <Link
              key="header-home"
              href="/"
              scroll={false}
              className="flex flex-row items-center justify-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              Home <HomeIcon className="h-5 w-5" />
            </Link>

            {userId ? (
              <Link
                href="/polls/create"
                className="flex flex-row items-center justify-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                Create <CardStackPlusIcon className="h-5 w-5" />
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="flex flex-row items-center justify-center gap-3 transition-colors hovact:text-purple-500"
                  onClick={() => setIsOpen(false)}
                >
                  Create <CardStackPlusIcon className="h-5 w-5" />
                </button>
              </SignInButton>
            )}

            <ProfileLink onClick={() => setIsOpen(false)} />
          </nav>

          <nav className="flex flex-col items-end gap-2">
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/terms" onClick={() => setIsOpen(false)}>
              Terms
            </Link>
            <Link href="/privacy" onClick={() => setIsOpen(false)}>
              Privacy
            </Link>
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
