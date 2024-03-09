"use client";

import {
  type Dispatch,
  type SetStateAction,
  useState,
  createContext,
  useContext,
} from "react";

export type Tab = "polls" | "votes";

export function UserPageProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("polls");
  return (
    <UserContext.Provider value={{ tab, setTab }}>
      {children}
    </UserContext.Provider>
  );
}

type UserContextType = {
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserPage() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be use within the user provider");
  }
  return context;
}
