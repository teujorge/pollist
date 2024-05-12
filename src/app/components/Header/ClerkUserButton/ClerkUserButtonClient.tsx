"use client";

import { cn } from "@/lib/utils";
import { useApp } from "@/app/(with-auth)/app";
import { OptionToggle } from "./settings/OptionToggle";
import { HideInWebView } from "../../HideInWebView";
import { buttonVariants } from "@/components/ui/button";
import { OptionToggleAds } from "./settings/OptionToggleAds";
import { BlockedUsersList } from "./settings/BlockedUsersList";
import { UserButton, useUser } from "@clerk/nextjs";
import { OptionToggleSensitive } from "./settings/OptionToggleSensitive";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  setShowAds,
  setPrivateAccount,
  setShowSensitiveContent,
} from "@/app/(with-auth)/users/actions";
import {
  Info,
  UserGear,
  UserList,
  AppleLogo,
  ArrowRight,
  ArrowSquareOut,
} from "@phosphor-icons/react";

export function ClerkUserButtonClient({
  pricingTable,
}: {
  pricingTable: React.ReactNode;
}) {
  const user = useUser();

  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="Settings"
        labelIcon={<UserGear size={16} />}
        url="settings"
      >
        <SettingsTab />
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage label="account" />
      <UserButton.UserProfilePage label="security" />
      <UserButton.UserProfileLink
        label="Visit Profile"
        labelIcon={<UserList size={16} />}
        url={"/users/" + user.user?.username}
      />
    </UserButton>
  );

  function SettingsTab() {
    const { userSettings } = useApp();

    console.log("bttn-userSettings", userSettings);

    const { user } = useUser();

    if (!user) return null;

    const manageSubWithAppleContent = (
      <>
        <AppleLogo size={15} /> Manage subscription with Apple
      </>
    );

    const manageSubWithStripeContent = (
      <>
        <ArrowSquareOut size={15} /> Manage subscription with Stripe
      </>
    );

    return (
      <div className="flex flex-col gap-10">
        {/* heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[2rem] font-semibold">Settings</h1>
          <p>Manage your preferences</p>
        </div>

        {/* user toggles */}
        <div className="flex flex-col gap-4">
          <h2 className="font-medium">
            Preferences
            <span className="text-sm font-normal text-accent-foreground/80">
              {userSettings.tier === "FREE" &&
                " (Upgrade to unlock all features)"}
            </span>
          </h2>
          <div className="flex flex-col gap-1">
            <OptionToggle
              hasAccess={userSettings.tier !== "FREE"}
              label={"Private Account"}
              isEnabled={userSettings.private}
              onToggleOption={setPrivateAccount}
            />

            <OptionToggleAds
              hasAccess={userSettings.tier !== "FREE"}
              isEnabled={!userSettings.ads}
              onToggleOption={setShowAds}
            />

            <OptionToggleSensitive
              isEnabled={userSettings.viewSensitive}
              onToggleOption={setShowSensitiveContent}
            />
          </div>
        </div>

        {/* blocked users */}
        <div className="flex flex-col gap-4">
          <h2 className="font-medium">Blocked Users</h2>
          <BlockedUsersList />
        </div>

        {/* subscription */}
        <div className="flex flex-col gap-4">
          <span className="inline-flex gap-2">
            <h2 className="font-medium">Billing</h2>
            <Popover>
              <PopoverTrigger>
                <Info size={20} />
              </PopoverTrigger>
              <PopoverContent>
                <p className="p-4">
                  Pollist uses <span className="font-medium">Stripe</span> to
                  manage payments on the web and{" "}
                  <span className="font-medium">Apple StoreKit</span> to manage
                  payments in the app.
                </p>
              </PopoverContent>
            </Popover>
          </span>

          {userSettings.tier === "FREE" ? (
            pricingTable
          ) : (
            // manage subscription
            <div className="flex flex-col gap-2">
              <p className="px-4 text-sm">
                Active Subscription:{" "}
                <span className="font-medium">{userSettings.tier}</span>
              </p>
              <HideInWebView
                fallback={
                  <ManageSubscriptionButton
                    href={
                      userSettings.appleTransaction
                        ? "https://pollist.org/subscription"
                        : process.env.NEXT_PUBLIC_STRIPE_BILLING_URL!
                    }
                  >
                    {userSettings.appleTransaction
                      ? manageSubWithAppleContent
                      : manageSubWithStripeContent}
                  </ManageSubscriptionButton>
                }
              >
                <ManageSubscriptionButton
                  href={
                    userSettings.appleTransaction
                      ? "https://support.apple.com/billing"
                      : process.env.NEXT_PUBLIC_STRIPE_BILLING_URL!
                  }
                >
                  {userSettings.appleTransaction
                    ? manageSubWithAppleContent
                    : manageSubWithStripeContent}
                </ManageSubscriptionButton>
              </HideInWebView>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function ManageSubscriptionButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ size: "sm", variant: "ghost" }),
        "flex items-center justify-start text-primary hovact:text-purple-400 [&>svg]:opacity-0 [&>svg]:transition-all [&>svg]:duration-200 [&>svg]:hovact:translate-x-2 [&>svg]:hovact:opacity-100",
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        {children}
      </div>
      <ArrowRight size={15} />
    </a>
  );
}
