import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export function OptionToggle({
  className,
  isEnabled,
  label,
  onToggleOption,
  invert = true,
}: {
  className?: string;
  isEnabled: boolean;
  label: string;
  onToggleOption: (optionEnabled: boolean) => Promise<void>;
  invert?: boolean;
}) {
  async function handleToggle() {
    await onToggleOption(invert ? !isEnabled : isEnabled);
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-row items-center justify-between rounded-md px-3 py-2 text-[0.8125rem] opacity-100 transition-all hovact:bg-accent-dark/50",
        className,
      )}
      onClick={handleToggle}
    >
      {label}
      <Switch key={`switch-toggle-${label}`} checked={isEnabled} />
    </div>
  );
}
