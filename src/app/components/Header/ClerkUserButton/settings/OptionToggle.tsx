"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "@/app/components/Loader";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";

export function OptionToggle({
  isEnabled: _isEnabled,
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
  const [isPending, startTransition] = useTransition();
  const [isEnabled, setIsEnabled] = useState(_isEnabled);

  async function handleToggle() {
    startTransition(async () => {
      if (!hasAccess) {
        toast.warning("Please subscribe to access this feature.");
        return;
      }

      try {
        await onToggleOption(invert ? !isEnabled : isEnabled);
        setIsEnabled((prev) => !prev);
      } catch (error) {
        toast.error("Failed to update account settings");
      }
    });
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-row items-center justify-between rounded-md transition-all",
        isPending
          ? "pointer-events-none opacity-50"
          : "opacity-100 hovact:bg-accent/40",
        !hasAccess && "opacity-50",
      )}
      onClick={handleToggle}
    >
      <span className="cursor-pointer px-8 py-2 text-sm">{label}</span>
      {isPending ? (
        <Loader className="mr-9 h-4 w-4 border-2" />
      ) : (
        <Switch checked={isEnabled} className="mr-8" />
      )}
    </div>
  );
}
