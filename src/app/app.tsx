"use client";

import Link from "next/link";
import GlobalLoading from "./loading";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAndCreateAnonUser } from "./api/anon/actions";
import { IconSvg } from "./svgs/IconSvg";

type UserStatus = {
  userId: string | undefined;
  isAnon: boolean;
};

export function App({ children }: { children: React.ReactNode }) {
  useCustomScrollbar();

  const { user } = useUser();

  const [userId, setUserId] = useState<string | undefined>();

  const [userStatus, setUserStatus] = useState<UserStatus>({
    userId: undefined,
    isAnon: true,
  });

  useEffect(() => {
    async function initUserId() {
      const id = await checkAndCreateAnonUser();
      setUserId(id);
    }
    void initUserId();
  }, []);

  useEffect(() => {
    if (user) {
      setUserStatus({ userId: user.id, isAnon: false });
    } else {
      setUserStatus({ userId: userId, isAnon: true });
    }
  }, [user, userId]);

  // log userStatus
  useEffect(() => {
    console.log("userStatus", userStatus);
  }, [userStatus]);

  return (
    <AppProvider value={userStatus}>
      <Header userId={userStatus.userId} />
      {userStatus.userId ? children : <GlobalLoading />}
    </AppProvider>
  );
}

const AppContext = createContext<UserStatus | undefined>(undefined);

type AppProviderProps = {
  value: UserStatus;
  children: React.ReactNode;
};

function AppProvider({
  value,
  children,
}: AppProviderProps & { children: React.ReactNode }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

function useCustomScrollbar() {
  useEffect(() => {
    const isSafariMac = /Macintosh.*Safari/.test(navigator.userAgent);
    if (isSafariMac) return;

    const css = `
      ::-webkit-scrollbar {
        width: 9px;
      }

      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 10px 10px transparent;
        border-radius: 2rem;
      }

      ::-webkit-scrollbar-thumb {
        min-height: 1.5rem;
        border-radius: 1.5rem;
        box-shadow: inset 0 0 10px 10px #444;
        border: 3px solid transparent;
        transition: all 150ms ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        box-shadow: inset 0 0 10px 10px #666;
        border: 2px solid transparent;
      }

      ::-webkit-scrollbar-button {
        display: none;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup the style element on unmount
      document.head.removeChild(styleSheet);
    };
  }, []);
}

function Header({ userId }: { userId?: string }) {
  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/"
          className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-purple-500 [&>svg>path]:hovact:stroke-purple-500"
        >
          <IconSvg className="h-full w-full" />
        </Link>
      </div>

      <div className="flex flex-row items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/polls/create">Create</Link>
        {userId && <Link href={`/users/${userId}`}>Me</Link>}

        <SignedIn>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex h-8 w-fit items-center [&>button]:transition-colors [&>button]:hovact:text-purple-500">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
      </div>
    </header>
  );
}
