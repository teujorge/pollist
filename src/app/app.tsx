"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAndCreateAnonUser } from "./api/anon/actions";

type UserStatus = {
  userId: string | undefined;
  isAnon: boolean | undefined;
};

export function App({ children }: { children: React.ReactNode }) {
  useCustomScrollbar();

  const { user } = useUser();
  const [userStatus, setUserStatus] = useState<UserStatus>({
    userId: undefined,
    isAnon: undefined,
  });

  useEffect(() => {
    async function updateStatus() {
      // If the user is logged in, set the userStatus
      if (user?.id) {
        setUserStatus({ userId: user.id, isAnon: false });
      }

      // If the user is not logged in, use IP Address
      else {
        if (
          userStatus.userId === undefined &&
          userStatus.isAnon === undefined
        ) {
          setUserStatus({ userId: undefined, isAnon: true });
          return;
        }

        const id = await checkAndCreateAnonUser();
        if (!user?.id) {
          setUserStatus({ userId: id, isAnon: true });
        }
      }
    }

    void updateStatus();
  }, [user]);

  // log userStatus
  useEffect(() => {
    console.log("userStatus", userStatus);
  }, [userStatus]);

  return <AppProvider value={userStatus}>{children}</AppProvider>;
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
