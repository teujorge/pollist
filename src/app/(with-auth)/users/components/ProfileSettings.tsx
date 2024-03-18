import { ProfileToggleAds } from "./ProfileToggleAds";
import { ProfileTogglePrivate } from "./ProfileTogglePrivate";
import type { GetUser } from "../actions";

type UserSettings = {
  private: GetUser["private"];
  ads: GetUser["ads"];
};

export function ProfileSettings({
  private: isPrivate,
  ads: showAds,
}: UserSettings) {
  return (
    <div className="flex flex-col gap-2 [&>form]:flex [&>form]:h-6 [&>form]:w-full [&>form]:flex-row [&>form]:items-center [&>form]:justify-between [&>form]:gap-2 [&>form]:transition-opacity">
      <ProfileTogglePrivate isPrivate={isPrivate} />
      <ProfileToggleAds showAds={showAds} />
    </div>
  );
}
