"use client";

import Link from "next/link";
import Image from "next/image";

import { Loader } from "../../Loader";
import { useApp } from "@/app/(with-auth)/app";
import { useState } from "react";
import { GearSix, SignOut, UserCircle } from "@phosphor-icons/react";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ClerkUserButton() {
  const { setShowUserSettings } = useApp();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [isSigningOut, setIsSigningOut] = useState(false);

  return isSignedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id="clerk-user-button"
          className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-transparent transition-colors hover:bg-accent focus:bg-accent active:bg-accent"
        >
          <Image
            className="rounded-full"
            src={user.imageUrl}
            alt="avatar"
            width={28}
            height={28}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-accent-dark sm:w-96">
        {/* user info */}
        <div className="flex w-full flex-row items-center justify-start gap-4 border-b border-accent bg-background p-4">
          <Image
            className="rounded-full"
            src={user.imageUrl}
            alt="avatar"
            width={36}
            height={36}
          />
          <div className="flex flex-col items-start justify-center text-sm">
            <span>{user.fullName}</span>
            <span>{user.username}</span>
          </div>
        </div>
        {/* menu buttons */}

        <DropdownMenuItem
          id="clerk-user-button-manage-account"
          onClick={() => setShowUserSettings(true)}
        >
          <GearSix
            size={15}
            weight="fill"
            className="rounded-full fill-accent-foreground"
          />
          Manage account
        </DropdownMenuItem>

        <Link
          href={`/users/${user.username}`}
          className="hovact:text-foreground"
        >
          <DropdownMenuItem>
            <UserCircle
              size={15}
              weight="fill"
              className="rounded-full fill-accent-foreground"
            />
            View Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          className="rounded-b-lg"
          disabled={isSigningOut}
          onClick={async (e) => {
            e.preventDefault();
            setIsSigningOut(true);
            try {
              await signOut();
            } catch (error) {
              console.error("signOut error: ", error);
            } finally {
              setIsSigningOut(false);
            }
          }}
        >
          {isSigningOut ? (
            <Loader className="h-[15px] w-[15px] border-2" />
          ) : (
            <SignOut
              size={15}
              weight="fill"
              className="rounded-full fill-accent-foreground"
            />
          )}
          Sign out
        </DropdownMenuItem>
        {/* menu footer */}
        <div className="flex w-full flex-row items-center justify-end gap-3 px-6 py-3 text-xs sm:gap-4">
          <a
            href="https://pollist.org/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <a
            href="https://pollist.org/tos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <SignInButton mode="modal" />
  );
}
