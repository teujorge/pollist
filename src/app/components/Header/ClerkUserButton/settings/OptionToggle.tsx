import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

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
  const [isEnabled, setIsEnabled] = useState(_isEnabled);

  async function handleToggle() {
    if (!hasAccess) {
      toast.warning("Please subscribe to access this feature.");
      return;
    }

    const originalIsEnabled = isEnabled;
    setIsEnabled(!originalIsEnabled);

    try {
      await onToggleOption(invert ? !isEnabled : isEnabled);
    } catch (error) {
      toast.error("Failed to update account settings");
      setIsEnabled(originalIsEnabled);
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-row items-center justify-between rounded-md opacity-100 transition-all hovact:bg-accent-dark",
        !hasAccess && "opacity-50",
      )}
      onClick={handleToggle}
    >
      <span className="cursor-pointer px-8 py-2 text-sm">{label}</span>
      <Switch checked={isEnabled} className="mr-8" />
    </div>
  );
}
