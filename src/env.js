import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    CRON_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_SUB_FREE_PRICE: z.string(),
    STRIPE_SUB_PRO_PRICE: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    FIREBASE_SERVICE_ACCOUNT_KEY: z.string(),
    APNS_KEY: z.string(),
    APNS_KEY_ID: z.string(),
    APNS_TEAM_ID: z.string(),
    APNS_BUNDLE_ID: z.string(),
    IAP_KEY_ID: z.string(),
    IAP_ISSUER_ID: z.string(),
    IAP_PRO_PRODUCT_ID: z.string(),
    IAP_SUBSCRIPTION_KEY: z.string(),
    CONTACT_FORM_ACCESS_KEY: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string(),
    NEXT_PUBLIC_STRIPE_BILLING_URL: z.string(),
    NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_PRICE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_URL: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // server
    CRON_SECRET: process.env.CRON_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_SUB_FREE_PRICE: process.env.STRIPE_SUB_FREE_PRICE,
    STRIPE_SUB_PRO_PRICE: process.env.STRIPE_SUB_PRO_PRICE,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET_KEY: process.env.CLERK_WEBHOOK_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    APNS_KEY: process.env.APNS_KEY,
    APNS_KEY_ID: process.env.APNS_KEY_ID,
    APNS_TEAM_ID: process.env.APNS_TEAM_ID,
    APNS_BUNDLE_ID: process.env.APNS_BUNDLE_ID,
    IAP_KEY_ID: process.env.IAP_KEY_ID,
    IAP_ISSUER_ID: process.env.IAP_ISSUER_ID,
    IAP_SUBSCRIPTION_KEY: process.env.IAP_SUBSCRIPTION_KEY,
    IAP_PRO_PRODUCT_ID: process.env.IAP_PRO_PRODUCT_ID,
    CONTACT_FORM_ACCESS_KEY: process.env.CONTACT_FORM_ACCESS_KEY,
    NODE_ENV: process.env.NODE_ENV,

    // client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL,
    NEXT_PUBLIC_STRIPE_BILLING_URL: process.env.NEXT_PUBLIC_STRIPE_BILLING_URL,
    NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_URL:
      process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
