import Stripe from "stripe";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

type Subscription = {
  title: string;
  priceId: string | undefined | null;
  paymentLink: string | undefined | null;
  features: string[];
};

export function PricingTable({ userId }: { userId: string }) {
  const subscriptions: Subscription[] = [
    {
      title: "Free",
      priceId: null,
      paymentLink: null,
      features: ["Sharing", "Voting", "Commenting", "And more!"],
    },
    {
      title: "Pro",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_PRICE_ID,
      paymentLink: process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_URL,
      features: [
        "All Free features",
        "No ads",
        "Private account",
        "Future features",
      ],
    },
    // {
    //   title: "Premium",
    //   priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID,
    //   paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_SUBSCRIPTION_URL,
    //   features: [
    //     "All Pro features",
    //     "Early access",
    //     "Priority support",
    //     "More!",
    //   ],
    // },
  ];

  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 rounded-lg">
      {subscriptions.map((subscription) => (
        <Suspense
          key={subscription.title}
          fallback={
            <SubscriptionCard
              shimmer
              title={subscription.title}
              priceId={subscription.priceId}
              paymentLink={subscription.paymentLink}
              userId={userId}
              features={subscription.features}
            />
          }
        >
          <SubscriptionCard
            title={subscription.title}
            priceId={subscription.priceId}
            paymentLink={subscription.paymentLink}
            userId={userId}
            features={subscription.features}
          />
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
  features,
  shimmer = false,
}: {
  userId: string;
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
    priceId && paymentLink
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
        url === undefined && "pointer-events-none",
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
