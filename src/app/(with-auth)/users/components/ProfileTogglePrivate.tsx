"use client";

import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { useEffect, useState } from "react";
import { setPrivateAccount } from "../actions";

export function ProfileTogglePrivate({ isPrivate }: { isPrivate: boolean }) {
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(false);
  }, [isPrivate]);

  async function handleToggle() {
    setIsChanging(true);

    try {
      await setPrivateAccount(!isPrivate);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while updating your account settings.");
      }
      setIsChanging(false);
    }
  }

  return (
    <form
      className={`${isChanging ? "pointer-events-none opacity-50" : "opacity-100"}`}
    >
      <label htmlFor="username" className="text-sm">
        Private Account
      </label>
      {isChanging ? (
        <Loader className="h-4 w-4 border-2" />
      ) : (
        <input
          type="checkbox"
          id="private"
          name="private"
          defaultChecked={isPrivate}
          onChange={handleToggle}
        />
      )}
    </form>
  );
}
