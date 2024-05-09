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
  hasAccess,
  invert = true,
}: {
  isEnabled: boolean;
  label: string;
  onToggleOption: (optionEnabled: boolean) => Promise<void>;
  hasAccess: boolean;
  invert?: boolean;
}) {
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(false);
  }, [isEnabled]);

  async function handleToggle() {
    if (!hasAccess) {
      toast.warning("Please subscribe to access this feature.");
      return;
    }

    setIsChanging(true);

    try {
      await onToggleOption(invert ? !isEnabled : isEnabled);
    } catch (error) {
      setIsChanging(false);
      toast.error("Failed to update account settings");
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-row items-center justify-between rounded-md transition-all",
        isChanging
          ? "pointer-events-none opacity-50"
          : "opacity-100 hovact:bg-accent/40",
        !hasAccess && "opacity-50",
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
