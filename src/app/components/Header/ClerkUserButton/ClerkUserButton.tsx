import { cn } from "@/lib/utils";
import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { Loader } from "../../Loader";
import { Suspense } from "react";
import { OptionToggle } from "./settings/OptionToggle";
import { PricingTable } from "./settings/PricingTable";
import { HideInWebView } from "../../HideInWebView";
import { buttonVariants } from "@/components/ui/button";
import { OptionToggleAds } from "./settings/OptionToggleAds";
import { BlockedUsersList } from "./settings/BlockedUsersList";
import { ClerkUserButtonClient } from "./ClerkUserButtonClient";
import { OptionToggleSensitive } from "./settings/OptionToggleSensitive";
import {
  AppleLogo,
  ArrowRight,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";
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
    select: {
      id: true,
      tier: true,
      private: true,
      ads: true,
      viewSensitive: true,
      appleTransaction: true,
    },
  });

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
            {user.tier === "FREE" && " (Upgrade to unlock all features)"}
          </span>
        </h2>
        <div className="flex flex-col gap-1">
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

      {/* blocked users */}
      <div className="flex flex-col gap-4">
        <h2 className="font-medium">Blocked Users</h2>
        <BlockedUsersList />
      </div>

      {/* subscription */}
      <div className="flex flex-col gap-4">
        <h2 className="font-medium">Billing</h2>
        {user.tier === "FREE" ? (
          // pricing table
          <PricingTable userId={user.id} />
        ) : (
          // manage subscription
          <div className="flex flex-col gap-2">
            <p className="px-4 text-sm">
              Active Subscription:{" "}
              <span className="font-medium">{user.tier}</span>
            </p>
            <HideInWebView
              fallback={
                <ManageSubscriptionButton
                  href={
                    user.appleTransaction
                      ? "https://pollist.org/subscription"
                      : process.env.NEXT_PUBLIC_STRIPE_BILLING_URL!
                  }
                >
                  {user.appleTransaction
                    ? manageSubWithAppleContent
                    : manageSubWithStripeContent}
                </ManageSubscriptionButton>
              }
            >
              <ManageSubscriptionButton
                href={
                  user.appleTransaction
                    ? "https://support.apple.com/billing"
                    : process.env.NEXT_PUBLIC_STRIPE_BILLING_URL!
                }
              >
                {user.appleTransaction
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
