import { createContext, useContext } from "react";

type PopoverContextType = {
  isNotificationsOpen: boolean;
  setIsNotificationsOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined;
};

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
}

export function PopoverProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PopoverContextType;
}) {
  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}
