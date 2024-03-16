import { ProfileTogglePrivate } from "./ProfileTogglePrivate";

export function ProfileSettings({ isPrivate }: { isPrivate: boolean }) {
  return (
    <div className="flex flex-col gap-2 [&>form]:flex [&>form]:h-6 [&>form]:w-full [&>form]:flex-row [&>form]:items-center [&>form]:justify-between [&>form]:gap-2 [&>form]:transition-opacity">
      <ProfileTogglePrivate isPrivate={isPrivate} />
    </div>
  );
}
