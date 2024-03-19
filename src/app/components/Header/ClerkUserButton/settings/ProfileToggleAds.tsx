"use client";

import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { setShowAds } from "../../../../(with-auth)/users/actions";
import { useEffect, useState } from "react";

export function ProfileToggleAds({ showAds }: { showAds: boolean }) {
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(false);
  }, [showAds]);

  async function handleToggle() {
    setIsChanging(true);

    try {
      await setShowAds(!showAds);
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
      className={`relative rounded-md ${isChanging ? "pointer-events-none opacity-50" : "opacity-100 hovact:bg-accent/40"}`}
    >
      <label
        htmlFor="ads-toggle"
        className="flex h-full w-full cursor-pointer items-center justify-start px-8 py-2 text-sm"
      >
        Hide Ads
      </label>
      {isChanging ? (
        <Loader className="absolute right-5 h-4 w-4 border-2" />
      ) : (
        <input
          type="checkbox"
          id="ads-toggle"
          name="ads-toggle"
          defaultChecked={!showAds}
          className="absolute right-6"
          onChange={handleToggle}
        />
      )}
    </form>
  );
}
