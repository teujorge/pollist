"use client";

import { useApp } from "@/app/(with-auth)/app";
import { OptionToggle } from "./OptionToggle";

export function OptionToggleAds({
  hasAccess,
  isEnabled,
  onToggleOption,
}: {
  hasAccess: boolean;
  isEnabled: boolean;
  onToggleOption: (optionEnabled: boolean) => Promise<void>;
}) {
  const { setAds } = useApp();

  async function handleToggle() {
    await onToggleOption(isEnabled);
    setAds(isEnabled);
  }

  return (
    <OptionToggle
      hasAccess={hasAccess}
      label={"Hide Ads"}
      isEnabled={isEnabled}
      onToggleOption={handleToggle}
      invert={false}
    />
  );
}
