export type Subscription = {
  title: string;
  priceId: string | undefined | null;
  paymentLink: string | undefined | null;
  iosProductId: string | undefined | null;
  features: string[];
};

export const subscriptions: Subscription[] = [
  {
    title: "Free",
    priceId: null,
    paymentLink: null,
    iosProductId: null,
    features: ["Sharing", "Voting", "Commenting", "And more!"],
  },
  {
    title: "Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_PRICE_ID,
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_URL,
    iosProductId: process.env.IAP_PRO_PRODUCT_ID,
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
