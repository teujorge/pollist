import Stripe from "stripe";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { subscriptions } from "./utils";
import { HideInWebView } from "@/app/components/HideInWebView";
import type { Subscription } from "./utils";

export async function PricingTable() {
  const { userId } = auth();

  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 rounded-lg">
      {subscriptions.map((subscription) => (
        <Suspense
          key={subscription.title}
          fallback={
            <SubscriptionCard
              shimmer
              ios={false}
              userId={userId}
              {...subscription}
            />
          }
        >
          <HideInWebView
            fallback={
              <SubscriptionCard userId={userId} ios={true} {...subscription} />
            }
            showOnIOS={false}
          >
            <SubscriptionCard userId={userId} ios={false} {...subscription} />
          </HideInWebView>
        </Suspense>
      ))}
    </div>
  );
}

async function SubscriptionCard({
  userId,
  title,
  priceId,
  paymentLink,
  iosProductId,
  features,
  ios,
  shimmer = false,
}: {
  userId: string | null;
  ios: boolean;
  shimmer?: boolean;
} & Subscription) {
  if (priceId === undefined) throw new Error("Price id not found");
  if (paymentLink === undefined) throw new Error("Payment link not found");

  let price = 0;
  if (priceId) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const priceRes = await stripe.prices.retrieve(priceId);
    price = (priceRes.unit_amount ?? 0) / 100;
  }

  const url =
    ios && iosProductId
      ? `https://pollist.org/subscribe?product_id=${iosProductId}&client_reference_id=${userId}`
      : priceId && paymentLink
        ? `${paymentLink}?client_reference_id=${userId}`
        : undefined;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex w-56 flex-col gap-4 rounded-lg border border-accent p-4 transition-transform hover:scale-105 hovact:border-primary hovact:text-foreground",
        shimmer && "pointer-events-none",
        url === undefined && "pointer-events-none opacity-50",
      )}
    >
      <h3 className={cn("text-xl font-semibold", shimmer && "shimmer")}>
        {title}
      </h3>
      <div
        className={cn("flex flex-row items-end gap-1", shimmer && "shimmer")}
      >
        <span className={cn("text-4xl font-medium")}>{price}$</span>
        <span className={cn("text-xs font-normal text-accent-foreground")}>
          per
          <br />
          month
        </span>
      </div>
      <ul className="list-disc space-y-1 pl-6 pr-2 text-sm">
        {features.map((feature) => (
          <li key={feature} className={cn(shimmer && "shimmer")}>
            {feature}
          </li>
        ))}
      </ul>
    </a>
  );
}

/* pricing table embed code
<Script src="https://js.stripe.com/v3/pricing-table.js" />
{createElement("stripe-pricing-table", {
  "pricing-table-id": process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
  "publishable-key": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  "client-reference-id": userId,
})}       
*/
