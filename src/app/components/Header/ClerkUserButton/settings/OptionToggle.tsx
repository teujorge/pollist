"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function OptionToggle({
  isEnabled,
  label,
  onToggleOption,
  invert = true,
}: {
  isEnabled: boolean;
  label: string;
  onToggleOption: (optionEnabled: boolean) => Promise<void>;
  invert?: boolean;
}) {
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(false);
  }, [isEnabled]);

  async function handleToggle() {
    setIsChanging(true);

    try {
      await onToggleOption(invert ? !isEnabled : isEnabled);
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
    <div
      className={cn(
        "flex cursor-pointer flex-row items-center justify-between rounded-md",
        isChanging
          ? "pointer-events-none opacity-50"
          : "opacity-100 hovact:bg-accent/40",
      )}
      onClick={handleToggle}
    >
      <span className="cursor-pointer px-8 py-2 text-sm">{label}</span>
      {isChanging ? (
        <Loader className="mr-9 h-4 w-4 border-2" />
      ) : (
        <Switch checked={isEnabled} className="mr-8" />
      )}
    </div>
  );
}
