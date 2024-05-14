"use client";

import { cn } from "@/lib/utils";
import { useApp } from "@/app/(with-auth)/app";
import { useUser } from "@clerk/nextjs";
import { OptionToggle } from "./settings/OptionToggle";
import { HideInWebView } from "../../HideInWebView";
import { buttonVariants } from "@/components/ui/button";
import { OptionToggleAds } from "./settings/OptionToggleAds";
import { BlockedUsersList } from "./settings/BlockedUsersList";
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
  AppleLogo,
  ArrowRight,
  ArrowSquareOut,
} from "@phosphor-icons/react";

export function SettingsTab({
  pricingTable,
}: {
  pricingTable: React.ReactNode;
}) {
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
    <div className="flex flex-col gap-4 divide-y divide-accent-dark">
      {/* heading */}
      <h1 className="text-[1.0625rem] font-bold">Settings</h1>

      {/* user toggles */}
      <div className="flex flex-col gap-4 pt-4">
        <p className="text-[0.8125rem] font-medium">
          Preferences
          <span className="text-xs font-normal text-accent-foreground/80">
            {userSettings.tier === "FREE" &&
              " (Upgrade to unlock all features)"}
          </span>
        </p>
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
      <div className="flex flex-col gap-4 pt-4">
        <span className="inline-flex gap-2">
          <h2 className="text-[0.8125rem] font-medium">Blocked Users</h2>
          <Popover>
            <PopoverTrigger>
              <Info size={16} />
            </PopoverTrigger>
            <PopoverContent align="start">
              <p className="p-4">
                <span className="font-semibold">Blocked Users:</span> Their
                content will be obscured and you will not receive notifications
                from them.{" "}
                <span className="text-yellow-500">
                  Note: Blocked users can still see your content and interact
                  with it as usual.
                </span>
              </p>
            </PopoverContent>
          </Popover>
        </span>
        <div className="px-2">
          <BlockedUsersList />
        </div>
      </div>

      {/* subscription */}
      <div className="flex flex-col gap-4 pt-4">
        <span className="inline-flex gap-2">
          <h2 className="text-[0.8125rem] font-medium">Billing</h2>
          <Popover>
            <PopoverTrigger>
              <Info size={16} />
            </PopoverTrigger>
            <PopoverContent align="start">
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
          <div className="flex flex-col gap-2 px-2">
            <p className="text-[0.8125rem]">
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
        "flex items-center justify-start text-primary hovact:bg-accent-dark/50 hovact:text-purple-400 [&>svg]:opacity-0 [&>svg]:transition-all [&>svg]:duration-200 [&>svg]:hovact:translate-x-2 [&>svg]:hovact:opacity-100",
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        {children}
      </div>
      <ArrowRight size={15} />
    </a>
  );
}
