import { cn } from "@/lib/utils";
import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { Loader } from "../../Loader";
import { Suspense } from "react";
import { ProfileToggleAds } from "./settings/ProfileToggleAds";
import { PricingTableEmbed } from "./settings/PricingTableEmbed";
import { ProfileTogglePrivate } from "./settings/ProfileTogglePrivate";
import { ClerkUserButtonClient } from "./ClerkUserButtonClient";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
        <Link href={`/users/${user.username}`} className="text-xs">
          Visit your profile page
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-medium">
          Preferences
          <span className="text-sm font-normal text-accent-foreground/80">
            {user.tier === "FREE" && " (Upgrade to unlock)"}
          </span>
        </h2>
        <div
          className={cn(
            "flex flex-col gap-2 [&>form]:flex [&>form]:w-full [&>form]:flex-row [&>form]:items-center [&>form]:justify-between [&>form]:gap-2 [&>form]:transition-opacity",
            {
              "[&>form]:pointer-events-none [&>form]:select-none [&>form]:opacity-50":
                user.tier === "FREE",
            },
          )}
        >
          <ProfileTogglePrivate isPrivate={user.private} />
          <ProfileToggleAds showAds={user.ads} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-medium">Billing</h2>
        {user.tier === "FREE" ? (
          <div>
            <PricingTableEmbed userId={user.id} />
          </div>
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
              className="flex flex-row items-center justify-between gap-4 rounded-lg px-6 py-2 text-[0.8125rem] text-primary transition-colors hovact:bg-primary/35"
            >
              <div className="flex flex-row items-center justify-center gap-4">
                <ExternalLinkIcon /> Manage subscription through stripe
              </div>
              <ArrowRightIcon />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
