"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAndCreateAnonUser } from "./api/anon/actions";

export function App({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userId, setUserId] = useState(user?.id);
  const [isAnon, setIsAnon] = useState(user?.id === undefined);

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
  }, []);

  useEffect(() => {
    console.log("app -> user?.id", user?.id);

    // If the user is logged in, set the user ID
    if (user?.id) {
      setUserId(user.id);
      setIsAnon(false);
    }
    // If the user is not logged in, get ip address and create an anon user if needed
    else {
      checkAndCreateAnonUser()
        .then((id) => {
          if (!user?.id) {
            setUserId(id);
            setIsAnon(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setUserId(undefined);
          setIsAnon(true);
        });
    }
  }, [user]);

  // log userId changes
  useEffect(() => {
    console.log("app -> userId", userId);
  }, [userId]);

  return <AppProvider value={{ userId, isAnon }}>{children}</AppProvider>;
}

type AppContextType = {
  userId: string | undefined;
  isAnon: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  value: AppContextType;
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
