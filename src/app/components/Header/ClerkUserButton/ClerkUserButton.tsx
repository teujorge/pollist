import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs";
import { Loader } from "../../Loader";
import { Suspense } from "react";
import { ProfileLink } from "./ProfileLink";
import { OptionToggle } from "./settings/OptionToggle";
import { PricingTable } from "./settings/PricingTable";
import { OptionToggleAds } from "./settings/OptionToggleAds";
import { ClerkUserButtonClient } from "./ClerkUserButtonClient";
import { OptionToggleSensitive } from "./settings/OptionToggleSensitive";
import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import {
  setShowAds,
  setPrivateAccount,
  setShowSensitiveContent,
} from "@/app/(with-auth)/users/actions";

export function ClerkUserButton() {
  return (
    <ClerkUserButtonClient
      settings={
        <Suspense fallback={<Loader />}>
          <SettingsTab />
        </Suspense>
      }
    />
  );
}

async function SettingsTab() {
  const { userId } = auth();

  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-[2rem] font-semibold">Settings</h1>
        <p>Manage your preferences</p>
        <ProfileLink href={`/users/${user.username}`} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-medium">
          Preferences
          <span className="text-sm font-normal text-accent-foreground/80">
            {user.tier === "FREE" && " (Upgrade to unlock all features)"}
          </span>
        </h2>
        <div className="flex flex-col gap-2 [&>form]:flex [&>form]:w-full [&>form]:flex-row [&>form]:items-center [&>form]:justify-between [&>form]:gap-2 [&>form]:transition-opacity">
          <OptionToggle
            hasAccess={user.tier !== "FREE"}
            label={"Private Account"}
            isEnabled={user.private}
            onToggleOption={setPrivateAccount}
          />
          <OptionToggleAds
            hasAccess={user.tier !== "FREE"}
            isEnabled={!user.ads}
            onToggleOption={setShowAds}
          />
          <OptionToggleSensitive
            isEnabled={user.viewSensitive}
            onToggleOption={setShowSensitiveContent}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-medium">Billing</h2>
        {user.tier === "FREE" ? (
          <PricingTable userId={user.id} />
        ) : (
          <div className="flex flex-col gap-2">
            <p className="px-4 text-sm">
              Active Subscription:{" "}
              <span className="font-medium">{user.tier}</span>
            </p>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_BILLING_URL ?? "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center justify-between gap-4 rounded-lg px-6 py-2 text-[0.8125rem] text-primary transition-colors hovact:bg-primary/35 [&>svg]:opacity-0 [&>svg]:transition-all [&>svg]:duration-200 [&>svg]:hovact:translate-x-2 [&>svg]:hovact:opacity-100"
            >
              <div className="flex flex-row items-center justify-center gap-4">
                <ArrowSquareOut size={15} /> Manage subscription through stripe
              </div>
              <ArrowRight size={15} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
