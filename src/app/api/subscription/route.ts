import { db } from "@/server/prisma";
import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { analyticsServerClient } from "@/server/analytics";
import type { NextRequest } from "next/server";
import type { SubTier, User } from "@prisma/client";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(null, {
      status: 401,
      statusText: "Unauthorized: No Stripe key",
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;

  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized: No signature",
      });
    }

    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    let logMessage = `Webhook signature verification failed`;
    if (err instanceof Error) logMessage += `: ${err.message}`;
    console.error(logMessage);
    return NextResponse.json(null, {
      status: 401,
      statusText: "Unauthorized: " + logMessage,
    });
  }

  // Handle the events
  switch (event.type) {
    // Checkout completed -> i.e. user has paid
    case "checkout.session.completed": {
      const checkoutSessionCompleted = event.data.object;
      const userId = checkoutSessionCompleted.client_reference_id;
      const customerId = checkoutSessionCompleted.customer?.toString();

      if (!userId) {
        const logMessage = `No user ID found in checkout session ${checkoutSessionCompleted.id}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 400,
          statusText: logMessage,
        });
      }

      if (!customerId) {
        const logMessage = `No customer ID found in checkout session ${checkoutSessionCompleted.id}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 400,
          statusText: logMessage,
        });
      }

      try {
        const productPriceId = await getProductPriceIdFromUser({
          customerId,
          stripe,
        });

        const newTier = getTier(productPriceId);
        await db.user.update({
          where: { id: userId },
          data: { ...newUserData(newTier), clerkId: customerId },
        });

        analyticsServerClient.capture({
          event: "Subscription Enabled",
          distinctId: userId,
          properties: {
            tier: newTier,
            source: "Stripe",
          },
        });
      } catch (e) {
        let logMessage = `⚠️  Failed to update user ${userId} in subscription in checkout session completed event`;
        if (e instanceof Error) logMessage += `: ${e.message}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 500,
          statusText: logMessage,
        });
      }

      break;
    }

    // Subscription updated -> i.e. user has changed their subscription
    case "customer.subscription.updated": {
      const subscriptionUpdated = event.data.object;
      const customerId = subscriptionUpdated.customer as string | undefined;

      if (!customerId) {
        // No user ID found in subscription
        // This is not an error, as the user may deleted their account
        // and thus have cancelled their subscription
        return NextResponse.json(null, { status: 200 });
      }

      try {
        const productPriceId = await getProductPriceIdFromUser({
          customerId,
          stripe,
        });

        const newTier = getTier(productPriceId);
        await db.user.updateMany({
          where: { clerkId: customerId },
          data: newUserData(newTier),
        });

        analyticsServerClient.capture({
          event: "Subscription Updated",
          distinctId: customerId,
          properties: {
            tier: newTier,
            source: "Stripe",
          },
        });
      } catch (e) {
        let logMessage = `⚠️  Failed to update customer ${customerId} in subscription in updated event`;
        if (e instanceof Error) logMessage += `: ${e.message}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 500,
          statusText: logMessage,
        });
      }

      break;
    }

    // Subscription deleted -> i.e. user has cancelled their subscription
    case "customer.subscription.deleted": {
      const subscriptionDeleted = event.data.object;
      const customerId = subscriptionDeleted.customer as string | undefined;

      if (!customerId) {
        // No user ID found in subscription
        // This is not an error, as the user may deleted their account
        // and thus have cancelled their subscription
        return NextResponse.json(null, { status: 200 });
      }

      try {
        const productPriceId = await getProductPriceIdFromUser({
          customerId,
          stripe,
        });

        const newTier = getTier(productPriceId);
        await db.user.updateMany({
          where: { clerkId: customerId },
          data: newUserData(newTier),
        });

        analyticsServerClient.capture({
          event: "Subscription Disabled",
          distinctId: customerId,
          properties: {
            tier: newTier,
            source: "Stripe",
          },
        });
      } catch (e) {
        let logMessage = `⚠️  Failed to update customer ${customerId} in subscription in deleted event`;
        if (e instanceof Error) logMessage += `: ${e.message}`;

        console.error(logMessage);
        return NextResponse.json(null, {
          status: 500,
          statusText: logMessage,
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json(null, { status: 200 });
}

// Get the product ID from the user's subscription
// Function assumes that the user has only one subscription
async function getProductPriceIdFromUser({
  customerId,
  stripe,
}: {
  customerId: string;
  stripe: Stripe;
}) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  const productId = subscriptions.data[0]?.items.data[0]?.price.id;

  return productId;
}

function getTier(productPriceId?: string): SubTier {
  if (!productPriceId) return "FREE";

  if (productPriceId === process.env.STRIPE_SUB_FREE_PRICE) return "FREE";

  if (productPriceId === process.env.STRIPE_SUB_PRO_PRICE) return "PRO";

  throw new Error(`Unknown product ID ${productPriceId}`);
}

function newUserData(tier: SubTier): Partial<User> {
  if (tier === "FREE") {
    return {
      tier: tier,
      ads: true,
      private: false,
    };
  }
  return { tier: tier };
}
