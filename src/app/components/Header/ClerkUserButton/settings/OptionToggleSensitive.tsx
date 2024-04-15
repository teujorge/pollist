"use client";

import { useApp } from "@/app/(with-auth)/app";
import { OptionToggle } from "./OptionToggle";

export function OptionToggleSensitive({
  isEnabled,
  onToggleOption,
}: {
  isEnabled: boolean;
  onToggleOption: (optionEnabled: boolean) => Promise<void>;
}) {
  const { setKey } = useApp();

  async function handleToggle() {
    await onToggleOption(!isEnabled);
    setKey(Math.random().toString());
  }

  return (
    <OptionToggle
      hasAccess={true}
      label="Show Sensitive Content"
      isEnabled={isEnabled}
      onToggleOption={handleToggle}
    />
  );
}
